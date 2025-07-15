import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Paper,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Warning,
  TrendingUp,
  People,
  Assignment,
} from "@mui/icons-material";
import { DynamicPageProps } from "../types/page.types";

// Interface for project dashboard model
interface ProjectDashboardModel {
  projectName?: string;
  status?: "active" | "on-hold" | "completed" | "planning";
  progress?: number;
  teamSize?: number;
  totalTasks?: number;
  completedTasks?: number;
  deadline?: string;
  budget?: number;
  spent?: number;
  technologies?: string[];
  description?: string;
}

const ProjectDashboard: React.FC<DynamicPageProps> = ({
  inputModel,
  pageEntityId,
}) => {
  // Initialize page state
  const [projectData] = useState<ProjectDashboardModel>({
    projectName: "Keystone Platform",
    status: "active",
    progress: 75,
    teamSize: 8,
    totalTasks: 45,
    completedTasks: 34,
    deadline: "2025-08-15",
    budget: 150000,
    spent: 112500,
    technologies: ["React", "TypeScript", "Azure", "Material-UI"],
    description:
      "A comprehensive platform for dynamic forms and user management.",
    ...inputModel,
  });

  useEffect(() => {
    // Simulate loading project data based on pageEntityId
    console.log(`Loading project dashboard for entity ID: ${pageEntityId}`);
    // In a real application, you would fetch data based on pageEntityId
  }, [pageEntityId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "on-hold":
        return "warning";
      case "completed":
        return "info";
      case "planning":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle />;
      case "on-hold":
        return <Schedule />;
      case "completed":
        return <CheckCircle />;
      case "planning":
        return <Warning />;
      default:
        return <Schedule />;
    }
  };

  const budgetProgress =
    ((projectData.spent || 0) / (projectData.budget || 1)) * 100;
  const taskProgress =
    ((projectData.completedTasks || 0) / (projectData.totalTasks || 1)) * 100;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Project Dashboard - {pageEntityId}
      </Typography>

      {/* Project Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {projectData.projectName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {projectData.description}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {getStatusIcon(projectData.status || "planning")}
            <Chip
              label={projectData.status?.toUpperCase()}
              color={getStatusColor(projectData.status || "planning") as any}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Project Progress */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Overall Progress: {projectData.progress}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={projectData.progress || 0}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Technologies */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {projectData.technologies?.map((tech, index) => (
            <Chip key={index} label={tech} size="small" variant="outlined" />
          ))}
        </Box>
      </Paper>

      {/* Metrics Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        {/* Team Size */}
        <Card elevation={2} sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <People color="primary" />
              <Box>
                <Typography variant="h4">{projectData.teamSize}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Team Members
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card elevation={2} sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Assignment color="info" />
              <Box>
                <Typography variant="h4">
                  {projectData.completedTasks}/{projectData.totalTasks}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tasks Completed
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={taskProgress}
              sx={{ mt: 1, height: 4, borderRadius: 2 }}
            />
          </CardContent>
        </Card>

        {/* Budget */}
        <Card elevation={2} sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TrendingUp color="success" />
              <Box>
                <Typography variant="h4">
                  ${(projectData.spent || 0).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget Spent
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                of ${(projectData.budget || 0).toLocaleString()} (
                {budgetProgress.toFixed(1)}%)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={budgetProgress}
                sx={{ height: 4, borderRadius: 2 }}
                color={
                  budgetProgress > 90
                    ? "error"
                    : budgetProgress > 75
                      ? "warning"
                      : "success"
                }
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Project Details */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Timeline */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Deadline
                </Typography>
                <Typography variant="body1">
                  {new Date(projectData.deadline || "").toLocaleDateString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Days Remaining
                </Typography>
                <Typography variant="body1">
                  {Math.ceil(
                    (new Date(projectData.deadline || "").getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="outlined" fullWidth>
                View Tasks
              </Button>
              <Button variant="outlined" fullWidth>
                Team Members
              </Button>
              <Button variant="outlined" fullWidth>
                Reports
              </Button>
              <Button variant="contained" fullWidth>
                Settings
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ProjectDashboard;
