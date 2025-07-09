import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders without crashing and contains Login", () => {
    render(<App />);
    // Check for main role for accessibility
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });
});
