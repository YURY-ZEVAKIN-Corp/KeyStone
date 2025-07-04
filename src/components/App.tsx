import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import Login from './Login';
import './App.css';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App">
        <Login />
      </div>
    </MsalProvider>
  );
};

export default App;
