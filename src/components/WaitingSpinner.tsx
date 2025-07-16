import React from "react";
import { WaitingState } from "../types/waiting.types";
import styles from "./WaitingSpinner.module.css";

interface WaitingSpinnerProps {
  state: WaitingState;
}

export const WaitingSpinner: React.FC<WaitingSpinnerProps> = ({ state }) => {
  const { message, size = "medium", theme = "primary" } = state;

  const spinnerClassName = `${styles.spinner} ${styles[size]} ${styles[theme]}`;

  return (
    <div className={styles.container}>
      <div className={spinnerClassName}>
        <div className={styles.ring}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
        <div className={styles.pulse}></div>
      </div>
      {message && (
        <div className={`${styles.message} ${styles[size]}`}>{message}</div>
      )}
    </div>
  );
};

export default WaitingSpinner;
