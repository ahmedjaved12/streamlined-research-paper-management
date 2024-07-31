import React from "react";
import styled from "styled-components";

const HomePage = () => {
  return (
    <Container>
      <Section>
        <Title>Welcome to SRPM</Title>
        <Description>
          Our system offers a variety of services including Search, Personalized Recommendations, Library, Translation and much more. Explore the sections below to learn more.
        </Description>
      </Section>

      <Section>
        <SectionTitle>Search</SectionTitle>
        <SectionDescription>
          We scrape data directly from Google Scholar to provide the most relevant academic
          articles. Our search results highlight author relevance, HEC ratings, and impact
          factors from several years. Stay informed with the most credible and up-to-date
          research. Whether you are a student, researcher, or professional, our search tool
          will help you find the most relevant articles for your work.
        </SectionDescription>
        <ImageWrapper>
          <Image src="../static/images/44.jpg" alt="Search" />
        </ImageWrapper>
        <Button onClick={() => window.location.href = 'search'}>Try Searching</Button>
      </Section>

      <Section>
        <SectionTitle>Personalized Recommendations</SectionTitle>
        <SectionDescription>
          Our system offers personalized recommendations to each user. Recommendations are based on user interests and recent searches.
          Sign Up to get recommendations.
        </SectionDescription>
        <ImageWrapper>
          <Image src="../static/images/recom.png" alt="Recommendations" />
        </ImageWrapper>
        <Button onClick={() => window.location.href = 'register'  }>Sign Up Now</Button>
      </Section>

      <Section>
        <SectionTitle>Translation</SectionTitle>
        <SectionDescription>
          Our system offers translation services into several different languages. Whether you
          need to translate an academic paper, a business document, or a personal letter, our
          translation feature ensures accuracy and reliability. We support a wide range of
          languages to help you communicate your ideas effectively and bridge language barriers.
        </SectionDescription>
        <ImageWrapper>
          <Image src="../static/images/3.jpg" alt="Translation" />
        </ImageWrapper>
        <Button onClick={() => window.location.href = 'translate'  }>Go to Translation Page</Button>
      </Section>

      <Section>
        <SectionTitle>Library Management</SectionTitle>
        <SectionDescription>
          Our system allows user to store their favorite articles in library.
          User can access their library from anywhere.
        </SectionDescription>
        <ImageWrapper>
          <Image src="../static/images/library.png" alt="Library" />
        </ImageWrapper>
        <Button onClick={() => window.location.href = 'library'}>Library</Button>
      </Section>

      <Section>
        <SectionTitle>Create Account</SectionTitle>
        <SectionDescription>
          Join our community and get access to all the features our system offers. Create an
          account today and start exploring our search, translation, and summarization tools.
          By creating an account, you can save your search results, track your translation requests,
          and access personalized features to enhance your experience.
        </SectionDescription>
        <ImageWrapper>
          <Image src="../static/images/43.jpg" alt="Create Account" />
        </ImageWrapper>
        <Button onClick={() => window.location.href = 'register'}>Create Account</Button>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  background: #f0f4f8;
`;

const Section = styled.div`
  margin-bottom: 60px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3em;
  color: #333;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
`;

const Description = styled.p`
  font-size: 1.3em;
  color: #555;
  margin-top: 10px;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 2.5em;
  color: #00796b;
  margin-top: 20px;
  font-weight: 600;
`;

const SectionDescription = styled.p`
  font-size: 1.2em;
  color: #666;
  margin-top: 10px;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 1em;
  color: #fff;
  background-color: #00796b;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #004d40;
    transform: translateY(-2px);
  }
`;

export default HomePage;
