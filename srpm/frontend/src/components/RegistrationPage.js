import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import axios from "axios";

const interestsList = [
  "Psycho-oncology",
  "Cancer treatment",
  "Palliative care",
  "Rehabilitation",
  "Mental health",
  "Coping strategies",
  "Emotional support",
  "Social aspects of cancer",
  "Cultural aspects of cancer",
  "Health psychology",
  "Clinical psychology",
  "Counseling",
  "Psychotherapy",
  "Health management",
  "Chronic disease+management",
  "Patient-centered care",
  "Interdisciplinary research",
  "Collaborative research",
  "Research methodology",
  "Ethnography",
  "Grounded theory",
  "Phenomenology",
  "Pragmatism",
  "Realism",
  "Symbolic interactionism",
  "Rational choice theory",
  "Game theory",
  "Social exchange theory",
  "Dramaturgy",
  "Network analysis",
  "System dynamics",
  "Agent-based modeling",
  "Simulation",
  "Data mining",
  "Text analysis",
  "Natural language+processing",
  "Machine learning",
  "Artificial intelligence",
  "Big data",
  "Data visualization",
];

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    country: "",
    occupation: "",
    age: "",
    password: "",
    confirmPassword: "",
    interests: [],
    otp: "",
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleInterestToggle = (interest) => {
    const selectedInterests = [...userData.interests];

    if (selectedInterests.includes(interest)) {
      selectedInterests.splice(selectedInterests.indexOf(interest), 1);
    } else {
      if (selectedInterests.length < 5) {
        selectedInterests.push(interest);
      }
    }

    setUserData({ ...userData, interests: selectedInterests });
  };

  const validateInput = () => {
    const newErrors = {};

    if (!userData.name) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(userData.name)) {
      newErrors.name = "Name can only contain letters";
    }

    if (!userData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!userData.country) {
      newErrors.country = "Country is required";
    }

    if (!userData.occupation) {
      newErrors.occupation = "Occupation is required";
    }

    if (!userData.age) {
      newErrors.age = "Age is required";
    } else if (!/^\d+$/.test(userData.age)) {
      newErrors.age = "Age must be a positive number";
    }

    if (!userData.password) {
      newErrors.password = "Password is required";
    } else if (userData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateInput()) {
      sendOTP();
    }
  };

  const sendOTP = async () => {
    setLoading(true);
    try {
      await axios.post("/backend/sendotp", { email: userData.email });
      setLoading(false);
      setStep(2);
    } catch (error) {
      setLoading(false);
      console.error("Error sending OTP:", error);
      setRegistrationError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    try {
      await axios.post("/backend/verifyotp", {
        email: userData.email,
        otp: userData.otp,
      });
      setLoading(false);
      setStep(3);
    } catch (error) {
      setLoading(false);
      console.error("OTP verification failed:", error);
      setRegistrationError(
        error.response?.data?.message || "OTP verification failed. Please try again."
      );
    }
  };

  const handleRegister = async () => {
    const userDataCopy = { ...userData };
    userDataCopy.interests = userDataCopy.interests.map((interest) =>
      interest.replace("+", " ")
    );
    try {
      await axios.post("/backend/register", userDataCopy);
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Registration Failed:", error);
      setRegistrationError(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const handleClosePopup = () => {
    setRegistrationSuccess(false);
    setRegistrationError(null);
  };

  return (
    <Container>
      <CardContainer>
        <Card>
          {step === 1 && (
            <>
              <Title>Personal Information</Title>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleInputChange}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleInputChange}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
              <Input
                type="text"
                name="country"
                placeholder="Country"
                onChange={handleInputChange}
              />
              {errors.country && <ErrorText>{errors.country}</ErrorText>}
              <Input
                type="text"
                name="occupation"
                placeholder="Occupation"
                onChange={handleInputChange}
              />
              {errors.occupation && <ErrorText>{errors.occupation}</ErrorText>}
              <Input
                type="text"
                name="age"
                placeholder="Age"
                onChange={handleInputChange}
              />
              {errors.age && <ErrorText>{errors.age}</ErrorText>}
              <Input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
              />
              {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
              <Button onClick={handleNext}>Next</Button>
              {loading && <LoadingAnimation />}
            </>
          )}
          {step === 2 && (
            <>
              <Title>Email Verification</Title>
              <Input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                onChange={handleInputChange}
              />
              <Button onClick={verifyOTP}>Verify OTP</Button>
              {loading && <LoadingAnimation />}
            </>
          )}
          {step === 3 && (
            <>
              <Title>Interests</Title>
              <InterestList>
                {interestsList.map((interest) => (
                  <InterestItem
                    key={interest}
                    selected={userData.interests.includes(interest)}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest.replaceAll("+", " ")}
                  </InterestItem>
                ))}
              </InterestList>
              <Button onClick={handleRegister}>Register</Button>
            </>
          )}
        </Card>
      </CardContainer>
      {registrationSuccess && (
        <Popup success>
          <CloseButton onClick={handleClosePopup}>&times;</CloseButton>
          <PopupContent>
            <p>Registration successful! Click to close.</p>
            <Button onClick={() => console.log("Proceed to login")}>
              Proceed to Login
            </Button>
          </PopupContent>
        </Popup>
      )}
      {registrationError && (
        <Popup>
          <CloseButton onClick={handleClosePopup}>&times;</CloseButton>
          <PopupContent>
            <p>{registrationError}</p>
          </PopupContent>
        </Popup>
      )}
    </Container>
  );
};

// Loading animation styles
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingAnimation = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #4caf50;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 2s linear infinite;
  margin: 20px auto;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const CardContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 600px;
  margin: 50px;
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin: 0 0 10px 0;
`;

const InterestList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

const InterestItem = styled.li`
  background-color: ${({ selected }) => (selected ? "#4caf50" : "#ddd")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  padding: 8px;
  margin: 5px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#45a049" : "#ccc")};
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  background-color: ${({ success }) => (success ? "#4caf50" : "#ff0000")};
  color: #fff;
  border-radius: 8px;
  border: 5px solid #ffffff;
  text-align: center;
  max-width: 400px;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
`;

const PopupContent = styled.div`
  margin-top: 20px;
`;

export default RegistrationPage;
