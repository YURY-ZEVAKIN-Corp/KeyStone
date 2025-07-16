import React from "react";
import { useWaiting } from "../hooks/useWaiting";
import styles from "./WaitingDemo.module.css";

/**
 * Demo component showcasing different waiting animation features
 */
export const WaitingDemo: React.FC = () => {
  const { showWaiting, hideWaiting, clearWaiting, waitFor } = useWaiting();

  const handleSimpleWaiting = () => {
    const id = showWaiting({ message: "Loading..." });
    setTimeout(() => hideWaiting(id), 3000);
  };

  const handleOverlayWaiting = () => {
    const id = showWaiting({
      message: "Processing with overlay...",
      overlay: true,
      size: "large",
      theme: "primary",
    });
    setTimeout(() => hideWaiting(id), 4000);
  };

  const handleInlineWaiting = () => {
    const id = showWaiting({
      message: "Inline loading...",
      overlay: false,
      size: "small",
      theme: "secondary",
    });
    setTimeout(() => hideWaiting(id), 2000);
  };

  const handleMultipleWaiting = () => {
    showWaiting({
      message: "Task 1...",
      overlay: false,
      size: "small",
      theme: "primary",
    });
    setTimeout(() => {
      showWaiting({
        message: "Task 2...",
        overlay: false,
        size: "medium",
        theme: "accent",
      });
    }, 1000);
    setTimeout(() => {
      clearWaiting();
    }, 5000);
  };

  const handleAsyncOperation = async () => {
    try {
      const result = await waitFor(
        new Promise((resolve) => setTimeout(() => resolve("Success!"), 3000)),
        { message: "Async operation in progress...", theme: "accent" },
      );
      console.log("Async result:", result);
    } catch (error) {
      console.error("Async error:", error);
    }
  };

  const handleFormSimulation = () => {
    const id = showWaiting({
      message: "Submitting form...",
      overlay: true,
      size: "medium",
      theme: "primary",
    });

    // Simulate form submission
    setTimeout(() => {
      hideWaiting(id);
      // Could show a toast here for success/error
    }, 2500);
  };

  const handlePageLoadSimulation = () => {
    const id = showWaiting({
      message: "Loading page content...",
      overlay: true,
      size: "large",
      theme: "secondary",
    });

    // Simulate page loading
    setTimeout(() => {
      hideWaiting(id);
    }, 3500);
  };

  return (
    <div className={styles.container}>
      <h2>Waiting Animation Demo</h2>
      <p>Test different waiting animation scenarios:</p>

      <div className={styles.buttonGrid}>
        <button onClick={handleSimpleWaiting} className={styles.button}>
          Simple Waiting (3s)
        </button>

        <button onClick={handleOverlayWaiting} className={styles.button}>
          Overlay Waiting (4s)
        </button>

        <button onClick={handleInlineWaiting} className={styles.button}>
          Inline Waiting (2s)
        </button>

        <button onClick={handleMultipleWaiting} className={styles.button}>
          Multiple Waitings
        </button>

        <button onClick={handleAsyncOperation} className={styles.button}>
          Async Operation
        </button>

        <button onClick={handleFormSimulation} className={styles.button}>
          Form Submission
        </button>

        <button onClick={handlePageLoadSimulation} className={styles.button}>
          Page Loading
        </button>

        <button
          onClick={clearWaiting}
          className={`${styles.button} ${styles.clearButton}`}
        >
          Clear All
        </button>
      </div>

      <div className={styles.info}>
        <h3>Usage Examples:</h3>
        <div className={styles.codeExample}>
          <h4>Basic Usage:</h4>
          <pre>{`const { showWaiting, hideWaiting } = useWaiting();
const id = showWaiting({ message: 'Loading...' });
// Later...
hideWaiting(id);`}</pre>
        </div>

        <div className={styles.codeExample}>
          <h4>With Promise:</h4>
          <pre>{`const { waitFor } = useWaiting();
const result = await waitFor(
  fetchData(),
  { message: 'Fetching data...' }
);`}</pre>
        </div>

        <div className={styles.codeExample}>
          <h4>Different Themes & Sizes:</h4>
          <pre>{`showWaiting({
  message: 'Processing...',
  size: 'large',           // 'small' | 'medium' | 'large'
  theme: 'accent',         // 'primary' | 'secondary' | 'accent'
  overlay: true            // true | false
});`}</pre>
        </div>
      </div>
    </div>
  );
};

export default WaitingDemo;
