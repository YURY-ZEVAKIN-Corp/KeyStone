import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { DynamicFormProps } from "../types/form.types";

// Interface for user model
interface UserModel {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  isActive: boolean;
  department?: string;
  phone?: string;
}

// Interface for form methods accessible from outside
interface UserEditFormMethods {
  onSave: () => Promise<void>;
  validate: () => boolean;
}

const UserEditForm = forwardRef<UserEditFormMethods, DynamicFormProps>(
  (props, ref) => {
    const { inputModel, onChange } = props;

    // Initialize form state
    const [formData, setFormData] = useState<UserModel>({
      name: "",
      email: "",
      role: "user",
      isActive: true,
      department: "",
      phone: "",
      ...inputModel,
    });

    const [errors, setErrors] = useState<
      Partial<Record<keyof UserModel, string>>
    >({});
    const [saveStatus, setSaveStatus] = useState<
      "idle" | "saving" | "success" | "error"
    >("idle");

    // Update parent component when data changes
    useEffect(() => {
      onChange(formData);
    }, [formData, onChange]);

    // Form validation
    const validateForm = (): boolean => {
      const newErrors: Partial<Record<keyof UserModel, string>> = {};

      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }

      if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone format";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Handle saving
    const handleSave = async (): Promise<void> => {
      if (!validateForm()) {
        throw new Error("Form contains errors");
      }

      setSaveStatus("saving");

      try {
        // API call simulation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Here could be an API call to save data
        console.log("Saving user data:", formData);

        setSaveStatus("success");

        // Reset status after some time
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("error");
        console.error("Save failed:", error);
        throw error;
      }
    };

    // Provide methods to parent component
    useImperativeHandle(ref, () => ({
      onSave: handleSave,
      validate: validateForm,
    }));

    const handleFieldChange = (field: keyof UserModel, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear field error on change
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {formData.id ? "Edit User" : "Create User"}
        </Typography>

        {saveStatus === "success" && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Data saved successfully!
          </Alert>
        )}

        {saveStatus === "error" && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error saving data
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Name"
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              disabled={saveStatus === "saving"}
            />

            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={saveStatus === "saving"}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <FormControl sx={{ flex: 1, minWidth: 250 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Роль"
                onChange={(e) => handleFieldChange("role", e.target.value)}
                disabled={saveStatus === "saving"}
              >
                <MenuItem value="user">Пользователь</MenuItem>
                <MenuItem value="manager">Менеджер</MenuItem>
                <MenuItem value="admin">Администратор</MenuItem>
              </Select>
            </FormControl>

            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Отдел"
              value={formData.department || ""}
              onChange={(e) => handleFieldChange("department", e.target.value)}
              disabled={saveStatus === "saving"}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              sx={{ flex: 1, minWidth: 250 }}
              label="Телефон"
              value={formData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={saveStatus === "saving"}
            />

            <Box
              sx={{
                flex: 1,
                minWidth: 250,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e) =>
                      handleFieldChange("isActive", e.target.checked)
                    }
                    disabled={saveStatus === "saving"}
                  />
                }
                label="Активный пользователь"
              />
            </Box>
          </Box>
        </Box>

        {formData.id && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">
              ID пользователя: {formData.id}
            </Typography>
          </Box>
        )}
      </Box>
    );
  },
);

UserEditForm.displayName = "UserEditForm";

export default UserEditForm;
