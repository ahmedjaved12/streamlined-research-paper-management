import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { render } from "react-dom"; 
import Header from './Header';
import Footer from './Footer';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import SearchPage from "./SearchPage";
import SummarizePage from "./SummarizePage";
import TranslationPage from "./TranslationPage";
import LibraryPage from "./LibraryPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import RecommendationsPage from "./RecommendationsPage";
import Navigation from './Navigation';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/adminlogin' || location.pathname === '/admindashboard';

  return (
    <div>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/summarize" element={<SummarizePage />} />
        <Route path="/translate" element={<TranslationPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const appDiv = document.getElementById("app");
render(<App />, appDiv); 
export default App;
