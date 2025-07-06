import React, { useState } from 'react';
import { useAuth } from '../services/useAuth';
import TokenDemo from './TokenDemo';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'tokens'>('profile');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Keystone Dashboard</h1>
        <div className="user-menu">
          <span>Welcome,{' '}
            <button
              className="user-name-btn"
              onClick={() => setActiveTab('profile')}
              aria-label="Show Profile"
              tabIndex={0}
              type="button"
            >
              {user?.name || user?.username}
            </button>
          </span>
          <button onClick={logout} className="logout-btn">
            Sign Out
          </button>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <button 
          className={`nav-button ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          JWT Tokens & API Calls
        </button>
      </nav>
      
      <main className="dashboard-content">
        {activeTab === 'profile' && (
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
        )}
        
        {activeTab === 'tokens' && <TokenDemo />}
      </main>
    </div>
  );
};

export default Dashboard;
