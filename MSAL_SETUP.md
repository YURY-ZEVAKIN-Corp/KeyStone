# Keystone - Keystone App with Microsoft Entra ID Authentication

This React TypeScript application integrates Microsoft Entra ID (formerly Azure AD) authentication using MSAL (Microsoft Authentication Library).

## 🚀 Features

- Microsoft Entra ID authentication
- TypeScript support
- Modern React hooks
- Responsive design
- User profile display
- Secure logout

## 🔧 Setup Instructions

### 1. Azure App Registration

Before running the app, you need to register it in Microsoft Entra ID:

1. Go to the [Azure Portal](https://portal.azure.com)
2. Navigate to **Microsoft Entra ID** > **App registrations**
3. Click **New registration**
4. Fill in the details:
   - **Name**: Keystone App (or your preferred name)
   - **Supported account types**: Choose based on your needs
   - **Redirect URI**: Select "Single-page application (SPA)" and enter `http://localhost:3000`
5. Click **Register**

### 2. Configure the Application

After registration, note down:

- **Application (client) ID**
- **Directory (tenant) ID**

### 3. Update Configuration

Edit `src/authConfig.ts` and replace the placeholder values:

```typescript
export const msalConfig: Configuration = {
  auth: {
    clientId: "YOUR_CLIENT_ID", // Replace with your actual client ID
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID", // Replace with your tenant ID
    redirectUri: "http://localhost:3000",
  },
  // ... rest of the config
};
```

### 4. API Permissions (Optional)

If you want to access Microsoft Graph API:

1. In your app registration, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph** > **Delegated permissions**
4. Add permissions like `User.Read`, `profile`, `openid`, `email`
5. Click **Grant admin consent** (if you're an admin)

## 🚀 Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
src/
├── authConfig.ts      # MSAL configuration
├── useAuth.ts         # Authentication hook
├── Login.tsx          # Login component
├── Login.css          # Login styles
├── Dashboard.tsx      # Dashboard component
├── Dashboard.css      # Dashboard styles
├── App.tsx           # Main app component
└── index.tsx         # App entry point
```

## 🔐 Authentication Flow

1. User clicks "Sign in with Microsoft"
2. MSAL redirects to Microsoft login page
3. User enters credentials
4. Microsoft redirects back to the app
5. MSAL handles the token exchange
6. User is authenticated and sees the dashboard

## 🛠️ Customization

### Styling

- Update `Login.css` and `Dashboard.css` to match your brand
- Modify the Microsoft logo in the login button if needed

### Scopes

- Update `loginRequest.scopes` in `authConfig.ts` to request additional permissions

### Authority

- Use `"common"` for multi-tenant applications
- Use your specific tenant ID for single-tenant applications

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your redirect URI is properly configured in Azure
2. **Client ID Not Found**: Double-check your client ID in `authConfig.ts`
3. **Authority Issues**: Verify your tenant ID or use "common" for multi-tenant

### Debug Mode

Enable MSAL logging by adding to `authConfig.ts`:

```typescript
export const msalConfig: Configuration = {
  // ... existing config
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};
```

## 📚 Learn More

- [Microsoft Authentication Library (MSAL) for JavaScript](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [Microsoft Entra ID Documentation](https://docs.microsoft.com/en-us/azure/active-directory/)
- [React MSAL Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react)
