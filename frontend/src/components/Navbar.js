import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Hospital Appointment System
        </Link>
        
        {user ? (
          <>
            <ul className="navbar-nav">
              <li>
                <Link 
                  to="/dashboard" 
                  className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
              </li>
              {user.role === 'patient' && (
                <li>
                  <Link 
                    to="/book-appointment" 
                    className={`nav-link ${isActive('/book-appointment') ? 'active' : ''}`}
                  >
                    Book Appointment
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  to="/appointments" 
                  className={`nav-link ${isActive('/appointments') ? 'active' : ''}`}
                >
                  Appointments
                </Link>
              </li>
              <li>
                <Link 
                  to="/users" 
                  className={`nav-link ${isActive('/users') ? 'active' : ''}`}
                >
                  Users
                </Link>
              </li>
            </ul>
            
            <div className="user-info">
              <span>Welcome, {user.name}</span>
              <span className="user-role">{user.role}</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          </>
        ) : (
          <ul className="navbar-nav">
            <li>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;