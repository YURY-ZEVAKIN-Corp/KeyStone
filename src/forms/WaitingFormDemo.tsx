import React from "react";
import { DynamicFormProps } from "../types/form.types";
import { useFormWaiting } from "../hooks/useFormWaiting";
import FormWaitingOverlay from "../components/FormWaitingOverlay";

export interface WaitingFormDemoInput {
  userId?: string;
  action?: "create" | "edit" | "delete" | "load";
  waitingType?: "short" | "medium" | "long";
  theme?: "primary" | "secondary" | "accent";
  size?: "small" | "medium" | "large";
  overlay?: boolean;
  shouldFail?: boolean;
}

export interface WaitingFormDemoOutput {
  success: boolean;
  userData?: {
    id: string;
    name: string;
    email: string;
    department: string;
    lastUpdated: string;
  };
  message: string;
  action: string;
}

/**
 * Demo form that showcases waiting animations during various operations
 */
const WaitingFormDemo: React.FC<DynamicFormProps> = ({
  inputModel,
  onChange,
  onSave,
}) => {
  const { waitFor, waitingState } = useFormWaiting();
  const typedInputModel = inputModel as WaitingFormDemoInput;
  const [formData, setFormData] = React.useState({
    name: "John Doe",
    email: "john.doe@company.com",
    department: "Engineering",
  });

  const [isProcessing, setIsProcessing] = React.useState(false);

  const getDuration = (type: string) => {
    switch (type) {
      case "short":
        return 1500;
      case "medium":
        return 3000;
      case "long":
        return 5000;
      default:
        return 2000;
    }
  };

  const simulateApiCall = (
    duration: number,
    shouldFail: boolean,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error("Simulated API error"));
        } else {
          resolve({
            id: `user-${Date.now()}`,
            ...formData,
            lastUpdated: new Date().toISOString(),
          });
        }
      }, duration);
    });
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      const duration = getDuration(typedInputModel.waitingType || "medium");
      const shouldFail = typedInputModel.shouldFail || false;
      const waitingMessage = getWaitingMessage();

      // Use the waiting animation with the specified configuration
      const userData = await waitFor(simulateApiCall(duration, shouldFail), {
        message: waitingMessage,
        theme: typedInputModel.theme || "primary",
        size: typedInputModel.size || "medium",
        overlay: typedInputModel.overlay !== false,
      });

      const result: WaitingFormDemoOutput = {
        success: true,
        userData,
        message: `${typedInputModel.action || "Operation"} completed successfully!`,
        action: typedInputModel.action || "unknown",
      };

      onChange(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      const result: WaitingFormDemoOutput = {
        success: false,
        message: `${typedInputModel.action || "Operation"} failed: ${errorMessage}`,
        action: typedInputModel.action || "unknown",
      };

      onChange(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    const result: WaitingFormDemoOutput = {
      success: false,
      message: "Operation cancelled by user",
      action: "cancel",
    };
    onChange(result);
  };

  const getActionText = () => {
    switch (typedInputModel.action) {
      case "create":
        return "Create User";
      case "edit":
        return "Update User";
      case "delete":
        return "Delete User";
      case "load":
        return "Load User Data";
      default:
        return "Process";
    }
  };

  const getWaitingMessage = () => {
    switch (typedInputModel.action) {
      case "create":
        return "Creating user account...";
      case "edit":
        return "Updating user information...";
      case "delete":
        return "Deleting user account...";
      case "load":
        return "Loading user data...";
      default:
        return "Processing request...";
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        width: "100%",
        maxWidth: "700px",
        position: "relative",
        margin: "0 auto",
        height: "500px", // Fixed height to create scrollable content
        overflow: "auto", // Enable scrolling
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <FormWaitingOverlay state={waitingState} />
      <h2>Waiting Animation Demo Form</h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: "#f0f7ff",
          borderRadius: "8px",
          border: "1px solid #d6e8ff",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#0066cc" }}>
          Demo Configuration:
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>Action:</strong> {typedInputModel.action || "default"}
          </div>
          <div>
            <strong>Duration:</strong> {typedInputModel.waitingType || "medium"}{" "}
            ({getDuration(typedInputModel.waitingType || "medium")}ms)
          </div>
          <div>
            <strong>Theme:</strong> {typedInputModel.theme || "primary"}
          </div>
          <div>
            <strong>Size:</strong> {typedInputModel.size || "medium"}
          </div>
          <div>
            <strong>Overlay:</strong>{" "}
            {typedInputModel.overlay !== false ? "yes" : "no"}
          </div>
          <div>
            <strong>Should Fail:</strong>{" "}
            {typedInputModel.shouldFail ? "yes" : "no"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: "24px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
          User Information
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          <div>
            <label
              htmlFor="demo-name-input"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#555",
              }}
            >
              Name:
            </label>
            <input
              id="demo-name-input"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              disabled={isProcessing}
            />
          </div>

          <div>
            <label
              htmlFor="demo-email-input"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#555",
              }}
            >
              Email:
            </label>
            <input
              id="demo-email-input"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              disabled={isProcessing}
            />
          </div>

          <div>
            <label
              htmlFor="demo-department-select"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#555",
              }}
            >
              Department:
            </label>
            <select
              id="demo-department-select"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
                backgroundColor: "white",
              }}
              disabled={isProcessing}
            >
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">Human Resources</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={handleCancel}
          disabled={isProcessing}
          style={{
            padding: "12px 24px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            color: "#666",
            borderRadius: "6px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          style={{
            padding: "12px 24px",
            border: "none",
            backgroundColor: typedInputModel.shouldFail ? "#dc3545" : "#007acc",
            color: "white",
            borderRadius: "6px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            opacity: isProcessing ? 0.6 : 1,
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {isProcessing ? getWaitingMessage() : getActionText()}
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "14px",
          color: "#666",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <p
          style={{ margin: "0 0 12px 0", fontWeight: "600", color: "#495057" }}
        >
          <strong>How it works:</strong>
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, lineHeight: "1.5" }}>
          <li>Click the action button to see the waiting animation</li>
          <li>The form uses the configuration above for the animation</li>
          <li>Different actions show different messages</li>
          <li>Try different themes, sizes, and durations</li>
          <li>Enable "Should Fail" to test error scenarios</li>
          <li>Notice how the animation appears only over the form area</li>
          <li>
            <strong>New Feature:</strong> The animation stays centered in the
            visible area even when you scroll!
          </li>
        </ul>
      </div>

      {/* Add extra content to make the form scrollable */}
      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#856404" }}>
          🔧 Scroll Test Section
        </h4>
        <p style={{ margin: "0 0 10px 0", color: "#856404" }}>
          This section is added to create scrollable content. Try scrolling up
          and down, then trigger a waiting animation to see how it stays
          centered in the visible window area!
        </p>
        <div style={{ padding: "20px 0" }}>
          <p>📋 Additional form fields for scroll testing:</p>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="project-name"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Project Name:
            </label>
            <input
              id="project-name"
              type="text"
              defaultValue="Sample Project"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="project-description"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Description:
            </label>
            <textarea
              id="project-description"
              rows={4}
              defaultValue="This is a sample project description to add more content to make the form scrollable."
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                resize: "vertical",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="project-priority"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Priority:
            </label>
            <select
              id="project-priority"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "16px",
          backgroundColor: "#d4edda",
          borderRadius: "8px",
          border: "1px solid #c3e6cb",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#155724" }}>
          ✨ Animation Features
        </h4>
        <p style={{ margin: "0 0 10px 0", color: "#155724" }}>
          The waiting animation now includes these advanced features:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#155724" }}>
          <li>Scroll-aware positioning</li>
          <li>Always centered in visible viewport</li>
          <li>Smooth transitions when scrolling</li>
          <li>Performance optimized with passive listeners</li>
          <li>Multi-container support</li>
        </ul>
      </div>
    </div>
  );
};

export default WaitingFormDemo;
