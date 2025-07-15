import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import {
  Settings,
  Save,
  Notifications,
  Security,
  Palette,
} from "@mui/icons-material";
import { DynamicPageProps } from "../types/page.types";

// Interface for settings model
interface SettingsModel {
  // Appearance
  theme?: "light" | "dark" | "auto";
  language?: string;
  fontSize?: "small" | "medium" | "large";

  // Notifications
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  soundEnabled?: boolean;

  // Security
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  passwordChangeRequired?: boolean;

  // General
  autoSave?: boolean;
  defaultPageSize?: number;
  timezone?: string;
}

const SettingsPage: React.FC<DynamicPageProps> = ({
  inputModel,
  pageEntityId,
}) => {
  // Initialize page state
  const [settings, setSettings] = useState<SettingsModel>({
    theme: "light",
    language: "en",
    fontSize: "medium",
    emailNotifications: true,
    pushNotifications: false,
    soundEnabled: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordChangeRequired: false,
    autoSave: true,
    defaultPageSize: 25,
    timezone: "UTC",
    ...inputModel,
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  useEffect(() => {
    // Simulate loading settings data based on pageEntityId
    console.log(`Loading settings for entity ID: ${pageEntityId}`);
    // In a real application, you would fetch data based on pageEntityId
  }, [pageEntityId]);

  const handleInputChange = (field: keyof SettingsModel, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Settings - {pageEntityId}
      </Typography>

      {saveStatus === "saved" && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {saveStatus === "error" && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save settings. Please try again.
        </Alert>
      )}

      {/* Appearance Settings */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Palette color="primary" />
            <Typography variant="h6">Appearance</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select
                value={settings.theme || "light"}
                onChange={(e) => handleInputChange("theme", e.target.value)}
                label="Theme"
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Font Size</InputLabel>
              <Select
                value={settings.fontSize || "medium"}
                onChange={(e) => handleInputChange("fontSize", e.target.value)}
                label="Font Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={settings.language || "en"}
                onChange={(e) => handleInputChange("language", e.target.value)}
                label="Language"
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Spanish</MenuItem>
                <MenuItem value="fr">French</MenuItem>
                <MenuItem value="de">German</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Notifications color="primary" />
            <Typography variant="h6">Notifications</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications || false}
                  onChange={(e) =>
                    handleInputChange("emailNotifications", e.target.checked)
                  }
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications || false}
                  onChange={(e) =>
                    handleInputChange("pushNotifications", e.target.checked)
                  }
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.soundEnabled || false}
                  onChange={(e) =>
                    handleInputChange("soundEnabled", e.target.checked)
                  }
                />
              }
              label="Sound Notifications"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Security color="primary" />
            <Typography variant="h6">Security</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.twoFactorAuth || false}
                  onChange={(e) =>
                    handleInputChange("twoFactorAuth", e.target.checked)
                  }
                />
              }
              label="Two-Factor Authentication"
            />

            <TextField
              label="Session Timeout (minutes)"
              type="number"
              value={settings.sessionTimeout || 30}
              onChange={(e) =>
                handleInputChange("sessionTimeout", parseInt(e.target.value))
              }
              fullWidth
              inputProps={{ min: 5, max: 120 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.passwordChangeRequired || false}
                  onChange={(e) =>
                    handleInputChange(
                      "passwordChangeRequired",
                      e.target.checked,
                    )
                  }
                />
              }
              label="Require Password Change on Login"
            />
          </Box>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Settings color="primary" />
            <Typography variant="h6">General</Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave || false}
                  onChange={(e) =>
                    handleInputChange("autoSave", e.target.checked)
                  }
                />
              }
              label="Auto-save Changes"
            />

            <TextField
              label="Default Page Size"
              type="number"
              value={settings.defaultPageSize || 25}
              onChange={(e) =>
                handleInputChange("defaultPageSize", parseInt(e.target.value))
              }
              fullWidth
              inputProps={{ min: 10, max: 100 }}
            />

            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={settings.timezone || "UTC"}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                label="Timezone"
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">Eastern Time</MenuItem>
                <MenuItem value="PST">Pacific Time</MenuItem>
                <MenuItem value="GMT">Greenwich Mean Time</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Save Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSave}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
