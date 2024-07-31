import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('/backend/adminlogin', { username, password });
      console.log('Login Successful:', response.data);
      setLoginError(null);
      setRedirect(true);
    } catch (error) {
      console.error('Login Failed:', error);
      setLoginError(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  useEffect(() => {
    if (redirect) {
      window.location.href = "/admindashboard";
    }
  }, [redirect]);

  return (
    <Container>
      <Card>
        <Title>Admin Login</Title>
        <Input
          type="text"
          name="username"
          placeholder="Admin Username"
          value={username}
          onChange={handleInputChange}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleInputChange}
        />
        <Button onClick={handleLogin}>Login</Button>
        <LoginLink>
          <a href="/login">Go to User Login</a>
        </LoginLink>
      </Card>
      {loginError && (
        <Popup onClick={() => setLoginError(null)}>
          {loginError}
        </Popup>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 400px;
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

const LoginLink = styled.p`
  text-align: center;
  margin-top: 10px;

  a {
    color: #2196f3;
    text-decoration: none;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  background-color: #ff0000;
  color: #fff;
  border-radius: 8px;
  border: 5px solid #ffffff;
  cursor: pointer;
  text-align: center;
  max-width: 400px;
`;

export default AdminLogin;
