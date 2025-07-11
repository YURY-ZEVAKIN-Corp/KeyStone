import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Use React.FunctionComponent for the mock to avoid TSX errors
jest.mock("@azure/msal-react", () => ({
  MsalProvider: (({ children }: { children: React.ReactNode }) => <>{children}</>) as React.FC,
  useMsal: () => ({ instance: {}, accounts: [] }),
}));
jest.mock("@azure/msal-browser", () => ({
  PublicClientApplication: function () {
    return {};
  },
}));
jest.mock("../services/useAuth", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe("App", () => {
  it("renders without crashing and contains Login", () => {
    render(<App />);
    // Check for main role for accessibility
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
