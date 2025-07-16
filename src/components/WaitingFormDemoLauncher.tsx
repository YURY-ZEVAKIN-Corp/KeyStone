import React from "react";
import { useFormService, useToastService } from "../hooks/useServices";
import {
  WaitingFormDemoInput,
  WaitingFormDemoOutput,
} from "../forms/WaitingFormDemo";
import styles from "./WaitingFormDemoLauncher.module.css";

/**
 * Component that demonstrates launching the waiting form demo with different configurations
 */
export const WaitingFormDemoLauncher: React.FC = () => {
  const formService = useFormService();
  const toastService = useToastService();
  const [lastResult, setLastResult] =
    React.useState<WaitingFormDemoOutput | null>(null);

  const openFormDemo = async (config: WaitingFormDemoInput) => {
    if (!formService || !toastService) return;

    try {
      const result = await formService.openForm<
        WaitingFormDemoInput,
        WaitingFormDemoOutput
      >("waitingFormDemo", config);

      setLastResult(result);

      if (result.success) {
        toastService.success(result.message);
      } else {
        toastService.error(result.message);
      }
    } catch (error) {
      console.error("Form was cancelled or errored:", error);
      toastService.info("Form operation was cancelled");
    }
  };

  const configurations = [
    {
      title: "Quick Create User",
      description: "Fast user creation with primary theme",
      config: {
        action: "create" as const,
        waitingType: "short" as const,
        theme: "primary" as const,
        size: "medium" as const,
        overlay: true,
        shouldFail: false,
      },
    },
    {
      title: "Edit User (Medium)",
      description: "Standard user editing with secondary theme",
      config: {
        action: "edit" as const,
        waitingType: "medium" as const,
        theme: "secondary" as const,
        size: "medium" as const,
        overlay: true,
        shouldFail: false,
      },
    },
    {
      title: "Delete User (Slow)",
      description: "Slow delete operation with danger styling",
      config: {
        action: "delete" as const,
        waitingType: "long" as const,
        theme: "primary" as const,
        size: "large" as const,
        overlay: true,
        shouldFail: false,
      },
    },
    {
      title: "Load Data (Success)",
      description: "Data loading with accent theme",
      config: {
        action: "load" as const,
        waitingType: "medium" as const,
        theme: "accent" as const,
        size: "medium" as const,
        overlay: true,
        shouldFail: false,
      },
    },
    {
      title: "Failing Operation",
      description: "Simulates a failed operation",
      config: {
        action: "create" as const,
        waitingType: "short" as const,
        theme: "primary" as const,
        size: "medium" as const,
        overlay: true,
        shouldFail: true,
      },
    },
    {
      title: "Small Inline Loading",
      description: "Small spinner without overlay",
      config: {
        action: "load" as const,
        waitingType: "short" as const,
        theme: "secondary" as const,
        size: "small" as const,
        overlay: false,
        shouldFail: false,
      },
    },
    {
      title: "Large Overlay Loading",
      description: "Large spinner with full overlay",
      config: {
        action: "create" as const,
        waitingType: "long" as const,
        theme: "accent" as const,
        size: "large" as const,
        overlay: true,
        shouldFail: false,
      },
    },
    {
      title: "Custom Configuration",
      description: "Medium edit with all options",
      config: {
        action: "edit" as const,
        waitingType: "medium" as const,
        theme: "primary" as const,
        size: "medium" as const,
        overlay: true,
        shouldFail: false,
        userId: "user-123",
      },
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Waiting Animation Form Demos</h2>
      <p>
        Click any button below to open the demo form with different waiting
        animation configurations:
      </p>

      <div className={styles.grid}>
        {configurations.map((config, index) => (
          <div key={index} className={styles.card}>
            <h3 className={styles.cardTitle}>{config.title}</h3>
            <p className={styles.cardDescription}>{config.description}</p>

            <div className={styles.configDetails}>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Action:</span>
                <span className={styles.configValue}>
                  {config.config.action}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Duration:</span>
                <span className={styles.configValue}>
                  {config.config.waitingType}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Theme:</span>
                <span
                  className={`${styles.configValue} ${styles[config.config.theme]}`}
                >
                  {config.config.theme}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Size:</span>
                <span className={styles.configValue}>{config.config.size}</span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Overlay:</span>
                <span className={styles.configValue}>
                  {config.config.overlay ? "Yes" : "No"}
                </span>
              </div>
              <div className={styles.configRow}>
                <span className={styles.configLabel}>Will Fail:</span>
                <span
                  className={`${styles.configValue} ${config.config.shouldFail ? styles.fail : styles.success}`}
                >
                  {config.config.shouldFail ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <button
              className={`${styles.launchButton} ${config.config.shouldFail ? styles.dangerButton : styles.primaryButton}`}
              onClick={() => openFormDemo(config.config)}
            >
              Launch Demo
            </button>
          </div>
        ))}
      </div>

      {lastResult && (
        <div className={styles.resultSection}>
          <h3>Last Form Result:</h3>
          <div
            className={`${styles.resultCard} ${lastResult.success ? styles.successResult : styles.errorResult}`}
          >
            <div className={styles.resultStatus}>
              <strong>Status:</strong>{" "}
              {lastResult.success ? "Success" : "Failed"}
            </div>
            <div className={styles.resultMessage}>
              <strong>Message:</strong> {lastResult.message}
            </div>
            <div className={styles.resultAction}>
              <strong>Action:</strong> {lastResult.action}
            </div>
            {lastResult.userData && (
              <div className={styles.resultData}>
                <strong>User Data:</strong>
                <pre>{JSON.stringify(lastResult.userData, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.infoSection}>
        <h3>How to Use:</h3>
        <ul>
          <li>
            Each card shows a different configuration for the waiting animation
          </li>
          <li>Click "Launch Demo" to open the form with that configuration</li>
          <li>The form will show the waiting animation when you submit it</li>
          <li>
            Different themes, sizes, and durations demonstrate the flexibility
          </li>
          <li>Some demos are configured to fail to show error handling</li>
          <li>Results are displayed below and shown as toast notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default WaitingFormDemoLauncher;
