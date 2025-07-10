import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import { useFormService } from "../hooks/useFormService";

interface UserModel {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  isActive: boolean;
  department?: string;
  phone?: string;
}

export const FormDemo: React.FC = () => {
  const { openForm } = useFormService();
  const [lastResult, setLastResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpenNewUserForm = async () => {
    try {
      setError(null);
      const result = await openForm<Partial<UserModel>, UserModel>(
        "userEditForm",
        {
          name: "",
          email: "",
          role: "user",
          isActive: true,
        },
      );

      setLastResult(result);
      console.log("Новый пользователь создан:", result);
    } catch (err) {
      setError("User creation cancelled");
      console.log("User creation cancelled:", err);
    }
  };

  const handleOpenEditUserForm = async () => {
    try {
      setError(null);
      const result = await openForm<UserModel, UserModel>("userEditForm", {
        id: "123",
        name: "Иван Иванов",
        email: "ivan@example.com",
        role: "manager",
        isActive: true,
        department: "IT",
        phone: "+7 999 123-45-67",
      });

      setLastResult(result);
      console.log("Пользователь отредактирован:", result);
    } catch (err) {
      setError("User editing cancelled");
      console.log("User editing cancelled:", err);
    }
  };

  const handleOpenProjectForm = async () => {
    try {
      setError(null);
      const result = await openForm("projectEditForm", {
        name: "Новый проект",
        description: "Описание проекта",
        status: "planning",
        priority: "medium",
        tags: ["веб", "разработка"],
        deadline: "2024-12-31",
      });

      setLastResult(result);
      console.log("Проект отредактирован:", result);
    } catch (err) {
      setError("Редактирование проекта отменено");
      console.log("Редактирование проекта отменено:", err);
    }
  };

  const handleOpenInvalidForm = async () => {
    try {
      setError(null);
      await openForm("nonExistentForm", {});
    } catch (err) {
      setError("Форма не найдена");
      console.error("Ошибка:", err);
    }
  };

  const handleOpenConfirmationForm = async () => {
    try {
      setError(null);
      const result = await openForm(
        "confirmationForm",
        {
          title: "Delete User",
          message:
            "Are you sure you want to delete this user? This action cannot be undone.",
          severity: "error",
        },
        {
          okButton: false,
          cancelButton: false,
          saveButton: false,
          yesButton: true,
          noButton: true,
        },
      );

      setLastResult(result);
      console.log("Confirmation result:", result);
    } catch (err) {
      setError("Confirmation cancelled");
      console.log("Confirmation cancelled:", err);
    }
  };

  const handleOpenSaveOnlyForm = async () => {
    try {
      setError(null);
      const result = await openForm(
        "projectEditForm",
        {
          name: "Quick Save Project",
          description: "Only save button enabled",
          status: "active",
          priority: "high",
        },
        {
          okButton: false,
          cancelButton: true,
          saveButton: true,
          yesButton: false,
          noButton: false,
        },
      );

      setLastResult(result);
      console.log("Save only result:", result);
    } catch (err) {
      setError("Save operation cancelled");
      console.log("Save operation cancelled:", err);
    }
  };

  const handleOpenDefaultConfirmation = async () => {
    try {
      setError(null);
      // This will use the default button config from the registry
      const result = await openForm("confirmationForm", {
        title: "Save Changes",
        message: "Do you want to save the changes before closing?",
        severity: "info",
      });

      setLastResult(result);
      console.log("Default confirmation result:", result);
    } catch (err) {
      setError("Default confirmation cancelled");
      console.log("Default confirmation cancelled:", err);
    }
  };

  const handleOpenButtonDemo = async () => {
    try {
      setError(null);
      const result = await openForm(
        "buttonDemoForm",
        {
          description:
            "This form shows all button types enabled through the registry configuration",
        },
        // Using default button config from registry (all buttons enabled)
      );

      setLastResult(result);
      console.log("Button demo result:", result);
    } catch (err) {
      setError("Button demo cancelled");
      console.log("Button demo cancelled:", err);
    }
  };

  const handleOpenCustomButtonDemo = async () => {
    try {
      setError(null);
      const result = await openForm(
        "buttonDemoForm",
        {
          description:
            "This form shows only OK and Cancel buttons through custom configuration",
        },
        {
          okButton: true,
          cancelButton: true,
          saveButton: false,
          yesButton: false,
          noButton: false,
        },
      );

      setLastResult(result);
      console.log("Custom button demo result:", result);
    } catch (err) {
      setError("Custom button demo cancelled");
      console.log("Custom button demo cancelled:", err);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Forms Demo with Button Configuration
      </Typography>

      <Typography variant="body1" color="textSecondary" paragraph>
        This demonstration shows how the dynamic modal forms system works with
        configurable buttons. Click the buttons below to open various forms with
        different button configurations.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenNewUserForm}
        >
          Create User (Default)
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenEditUserForm}
        >
          Edit User (Default)
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={handleOpenProjectForm}
        >
          Edit Project (Default)
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleOpenInvalidForm}
        >
          Open Non-existent Form
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={handleOpenConfirmationForm}
        >
          Confirmation (Yes/No)
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={handleOpenSaveOnlyForm}
        >
          Save Only Form
        </Button>

        <Button
          variant="contained"
          color="info"
          onClick={handleOpenDefaultConfirmation}
        >
          Default Confirmation
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpenButtonDemo}
        >
          Demo All Buttons
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpenCustomButtonDemo}
        >
          Demo Custom Buttons
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {lastResult && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Last Result:
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Show result for Yes/No confirmations */}
            {lastResult.result && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Result:
                </Typography>
                <Chip
                  label={lastResult.result.toUpperCase()}
                  size="small"
                  color={lastResult.result === "yes" ? "success" : "error"}
                />
              </Box>
            )}

            {/* Show name if available */}
            {lastResult.name && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Name:
                </Typography>
                <Typography variant="body2">{lastResult.name}</Typography>
              </Box>
            )}

            {/* Show email if available */}
            {lastResult.email && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Email:
                </Typography>
                <Typography variant="body2">{lastResult.email}</Typography>
              </Box>
            )}

            {/* Show description if available */}
            {lastResult.description && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Description:
                </Typography>
                <Typography variant="body2">
                  {lastResult.description}
                </Typography>
              </Box>
            )}

            {/* Show message if available */}
            {lastResult.message && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Message:
                </Typography>
                <Typography variant="body2">{lastResult.message}</Typography>
              </Box>
            )}

            {/* Show role if available */}
            {lastResult.role && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Role:
                </Typography>
                <Chip
                  label={lastResult.role}
                  size="small"
                  color={lastResult.role === "admin" ? "error" : "primary"}
                />
              </Box>
            )}

            {/* Show status if available */}
            {typeof lastResult.isActive !== "undefined" && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Status:
                </Typography>
                <Chip
                  label={lastResult.isActive ? "Active" : "Inactive"}
                  size="small"
                  color={lastResult.isActive ? "success" : "default"}
                />
              </Box>
            )}

            {lastResult.department && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Отдел:
                </Typography>
                <Typography variant="body2">{lastResult.department}</Typography>
              </Box>
            )}

            {lastResult.phone && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  Телефон:
                </Typography>
                <Typography variant="body2">{lastResult.phone}</Typography>
              </Box>
            )}

            {lastResult.id && (
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", minWidth: 100 }}
                >
                  ID:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {lastResult.id}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
        <Typography variant="h6" gutterBottom>
          Пример использования в коде:
        </Typography>

        <Box
          component="pre"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.875rem",
            overflow: "auto",
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: "divider",
          }}
        >
          {`// Использование FormService
import { FormService } from './services/FormService';

// Открытие формы и обработка результата
FormService.openForm('userEditForm', { name: 'John' })
  .then(data => console.log('Saved!', data))
  .catch(() => console.log('Cancelled'));

// Использование хука
import { useFormService } from './hooks/useFormService';

const { openForm } = useFormService();

const handleEdit = async () => {
  try {
    const result = await openForm('userEditForm', userData);
    // Обработка результата
  } catch (error) {
    // Форма была отменена
  }
};`}
        </Box>
      </Paper>
    </Box>
  );
};
