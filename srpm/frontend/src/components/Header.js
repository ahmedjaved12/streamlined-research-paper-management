import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; 

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid bg-dark text-light py-3">
      <div className="container">
        <h1>SRPM</h1>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
              <li className="nav-item">
                <Link to="/translate" className="nav-link">Translate</Link>
              </li>
              <li className="nav-item">
                <Link to="/search" className="nav-link">Search</Link>
              </li>
              <li className="nav-item">
                <Link to="/summarize" className="nav-link">Summarize</Link>
              </li>
              <li className="nav-item">
                <Link to="/library" className="nav-link">Library</Link>
              </li>
              <li className="nav-item">
                <Link to="/recommendations" className="nav-link">Recommendations</Link>
              </li>
            </ul>
            <button 
              className="btn btn-outline-light ml-auto" 
              onClick={() => navigate(-1)}
            >
              <img src="../static/images/back.png" alt="Back" style={{ height: '24px', width: '24px' }} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
