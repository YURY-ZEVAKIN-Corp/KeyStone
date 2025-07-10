import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { DynamicFormProps } from "../types/form.types";

// Interface for project model
interface ProjectModel {
  id?: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
  deadline?: string;
}

const ProjectEditForm: React.FC<DynamicFormProps> = ({
  inputModel,
  onChange,
}) => {
  const [formData, setFormData] = useState<ProjectModel>({
    name: "",
    description: "",
    status: "planning",
    priority: "medium",
    tags: [],
    ...inputModel,
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleFieldChange = (field: keyof ProjectModel, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleFieldChange("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleFieldChange(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const statusColors: Record<
    ProjectModel["status"],
    "default" | "info" | "success" | "warning"
  > = {
    planning: "default",
    active: "info",
    completed: "success",
    "on-hold": "warning",
  };

  const priorityColors: Record<
    ProjectModel["priority"],
    "default" | "info" | "warning" | "error"
  > = {
    low: "default",
    medium: "info",
    high: "warning",
    critical: "error",
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {formData.id ? "Edit Project" : "Create Project"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          fullWidth
          label="Project Name"
          value={formData.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          required
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleFieldChange("status", e.target.value)}
            >
              <MenuItem value="planning">Planning</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="on-hold">On Hold</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={(e) => handleFieldChange("priority", e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="critical">Critical</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          label="Deadline"
          type="date"
          value={formData.deadline || ""}
          onChange={(e) => handleFieldChange("deadline", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
            <TextField
              size="small"
              label="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {formData.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                size="small"
              />
            ))}
          </Stack>
        </Box>

        <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <Chip
              label={formData.status}
              color={statusColors[formData.status]}
              size="small"
            />
            <Chip
              label={`Priority: ${formData.priority}`}
              color={priorityColors[formData.priority]}
              size="small"
            />
          </Box>

          <Typography variant="body2">
            <strong>{formData.name || "Project Name"}</strong>
          </Typography>

          {formData.description && (
            <Typography variant="body2" color="textSecondary">
              {formData.description}
            </Typography>
          )}

          {formData.deadline && (
            <Typography variant="caption" color="textSecondary">
              Deadline:{" "}
              {new Date(formData.deadline).toLocaleDateString("en-US")}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectEditForm;
