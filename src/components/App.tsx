import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../authConfig';
import Login from './Login';
import './App.css';

/**
 * App is the root component that sets up MSAL authentication context and renders the main application UI.
 *
 * @remarks
 * - Uses functional components and hooks as per project standards.
 * - Applies accessibility best practices (role="main").
 * - Consider migrating to CSS modules for better style encapsulation.
 */
// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <div className="App" role="main">
        <Login />
      </div>
    </MsalProvider>
  );
};

export default App;
