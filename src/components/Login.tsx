import React from 'react';
import { useAuth } from '../services/useAuth';
import Dashboard from './Dashboard';
import './Login.css';

const Login: React.FC = () => {
  const { isAuthenticated, user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Keystone App</h1>
        <p>Please sign in with your Microsoft account to continue.</p>
        <button className="login-button" onClick={login}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
            <rect x="12" y="1" width="9" height="9" fill="#00a4ef"/>
            <rect x="1" y="12" width="9" height="9" fill="#ffb900"/>
            <rect x="12" y="12" width="9" height="9" fill="#7fba00"/>
          </svg>
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default Login;
