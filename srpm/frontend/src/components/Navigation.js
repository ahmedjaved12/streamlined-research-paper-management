import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/summarize">Summarize</Link></li>
        <li><Link to="/translate">Translate</Link></li>
        <li><Link to="/library">Library</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
