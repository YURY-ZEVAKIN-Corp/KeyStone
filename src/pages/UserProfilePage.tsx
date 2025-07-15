import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Avatar,
  Paper,
  Chip,
} from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { DynamicPageProps } from "../types/page.types";

// Interface for user profile model
interface UserProfileModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  department?: string;
  role?: string;
  joinDate?: string;
  skills?: string[];
  bio?: string;
}

const UserProfilePage: React.FC<DynamicPageProps> = ({
  inputModel,
  pageEntityId,
}) => {
  // Initialize page state
  const [userData, setUserData] = useState<UserProfileModel>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    department: "Engineering",
    role: "Senior Developer",
    joinDate: "2022-01-15",
    skills: ["React", "TypeScript", "Azure", "Node.js"],
    bio: "Experienced software developer with expertise in modern web technologies.",
    ...inputModel,
  });

  useEffect(() => {
    // Simulate loading user data based on pageEntityId
    console.log(`Loading user profile for entity ID: ${pageEntityId}`);
    // In a real application, you would fetch data based on pageEntityId
  }, [pageEntityId]);

  const handleInputChange = (field: keyof UserProfileModel, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setUserData((prev) => ({
      ...prev,
      skills,
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        User Profile - {pageEntityId}
      </Typography>

      {/* Profile Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar
            sx={{
              bgcolor: deepPurple[500],
              width: 80,
              height: 80,
              fontSize: 24,
            }}
          >
            {userData.firstName?.[0]}
            {userData.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {userData.firstName} {userData.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {userData.role} • {userData.department}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {userData.joinDate}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Content Area */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Personal Information */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="First Name"
                  value={userData.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={userData.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Email"
                  type="email"
                  value={userData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Department"
                  value={userData.department || ""}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Role"
                  value={userData.role || ""}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Skills and Bio */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={2} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Skills & Bio
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Skills (comma separated)"
                  value={userData.skills?.join(", ") || ""}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {userData.skills?.map((skill, index) => (
                    <Chip key={index} label={skill} variant="outlined" />
                  ))}
                </Box>
                <TextField
                  label="Bio"
                  value={userData.bio || ""}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
