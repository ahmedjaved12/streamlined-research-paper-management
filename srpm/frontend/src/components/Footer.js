import React from 'react';

const Footer = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('current_user');
    window.location.href = "/login";
  };

  return (
    <footer
      className="bg-dark text-center text-lg-start"
      style={{ position: 'fixed', bottom: 0, width: '100%', color: 'white' }}
    >
      <div
        className="text-center p-3 d-flex justify-content-between align-items-center"
        style={{ width: '100%' }}
      >
        <span>© {new Date().getFullYear()} SRPM</span>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        ) : (
          <a href='/login' style={{ color: 'white' }}>Log in to get full features.</a>
        )}
      </div>
    </footer>
  );
};

export default Footer;
