import React from "react";
import { useWaiting } from "../hooks/useWaiting";

/**
 * Simple example component showing how to use the waiting animation system
 */
export const WaitingExample: React.FC = () => {
  const { showWaiting, hideWaiting, waitFor } = useWaiting();

  // Example 1: Manual control
  const handleManualWaiting = () => {
    const id = showWaiting({
      message: "Processing your request...",
      size: "medium",
      theme: "primary",
    });

    // Simulate work
    setTimeout(() => hideWaiting(id), 3000);
  };

  // Example 2: With Promise (recommended)
  const handlePromiseWaiting = async () => {
    try {
      const result = await waitFor(
        // Simulate API call
        new Promise((resolve) =>
          setTimeout(() => resolve("Data loaded!"), 2000),
        ),
        { message: "Fetching data from server..." },
      );
      console.log("Result:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Example 3: Form submission simulation
  const handleFormSubmit = async () => {
    const formData = { name: "John", email: "john@example.com" };

    await waitFor(
      // Simulate form submission
      fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
      {
        message: "Saving user information...",
        theme: "accent",
        size: "large",
      },
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        gap: "16px",
        flexDirection: "column",
      }}
    >
      <h3>Waiting Animation Examples</h3>

      <button onClick={handleManualWaiting}>Manual Waiting (3s)</button>

      <button onClick={handlePromiseWaiting}>Promise Waiting (2s)</button>

      <button onClick={handleFormSubmit}>Form Submit Simulation</button>

      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Tips:</strong>
        </p>
        <ul>
          <li>
            Use <code>waitFor()</code> for automatic cleanup
          </li>
          <li>Provide meaningful loading messages</li>
          <li>Choose appropriate size and theme</li>
          <li>Handle errors gracefully</li>
        </ul>
      </div>
    </div>
  );
};

export default WaitingExample;
