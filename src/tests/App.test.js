import { render, screen } from "@testing-library/react";
import App from "../components/App";

jest.mock("@azure/msal-react", () => ({
  MsalProvider: (props) => <div>{props.children}</div>,
  useMsal: () => ({ instance: {}, accounts: [] }),
}));
jest.mock("@azure/msal-browser", () => ({
  PublicClientApplication: function () {
    return {};
  },
}));

test("renders Keystone App title and sign in button", () => {
  render(<App />);
  expect(screen.getByText(/Keystone App/i)).toBeInTheDocument();
  expect(screen.getByText(/Sign in with Microsoft/i)).toBeInTheDocument();
});
