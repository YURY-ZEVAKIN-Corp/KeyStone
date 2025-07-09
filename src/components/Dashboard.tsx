import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../services/useAuth';
import TokenDemo from './TokenDemo';
import './Dashboard.css';

const ProfilePage: React.FC<{ user: any }> = ({ user }) => (
  <div className="welcome-card">
    <h2>Welcome to Keystone!</h2>
    <p>You have successfully authenticated with Microsoft Entra ID.</p>
    <div className="user-details">
      <h3>Your Profile</h3>
      <p><strong>Name:</strong> {user?.name || 'Not available'}</p>
      <p><strong>Email:</strong> {user?.username}</p>
      <p><strong>Account ID:</strong> {user?.homeAccountId}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Keystone Dashboard</h1>
          <div className="user-menu">
            <span>Welcome,{' '}
              <Link
                className="user-name-btn"
                to="/profile"
                aria-label="Show Profile"
                tabIndex={0}
              >
                {user?.name || user?.username}
              </Link>
            </span>
            <button onClick={logout} className="logout-btn">
              Sign Out
            </button>
          </div>
        </header>
        <div className="dashboard-body">
        <div className="dashboard-nav">sss
        </div>
        <main className="dashboard-content">
          <Routes>
            <Route path="/profile" element={<ProfilePage user={user} />} />
            <Route path="/tokens" element={<TokenDemo />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </main>
        </div>
      </div>
    </Router>
  );
};

export default Dashboard;
