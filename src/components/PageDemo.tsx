import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRegisteredPages } from "../registry/PageRegistry";
import { requireService } from "../services/ServiceRegistry";
import type { PageServiceClass } from "../services/PageService";

const PageDemo: React.FC = () => {
  const navigate = useNavigate();
  const registeredPages = getRegisteredPages();

  const handleNavigateToPage = (pageId: string, entityId: string) => {
    const pageService = requireService<PageServiceClass>("PageService");
    const route = pageService.getPageRoute(pageId, entityId);
    navigate(route);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Dynamic Pages Demo
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This demo showcases the dynamic page system. Each page can be opened in
        the main screen with its own title, input model, and page entity ID.
        Pages can be addressed with routes like /page/pageType/pageEntityId/.
      </Alert>

      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registered Pages
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Click on any page below to open it with different entity IDs:
          </Typography>

          <List>
            {registeredPages.map((page, index) => (
              <React.Fragment key={page.pageId}>
                <ListItem>
                  <ListItemText
                    primary={page.displayName}
                    secondary={`Page ID: ${page.pageId} | Title: ${page.title}`}
                  />
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleNavigateToPage(page.pageId, "demo-1")
                      }
                    >
                      Open Demo 1
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleNavigateToPage(page.pageId, "demo-2")
                      }
                    >
                      Open Demo 2
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleNavigateToPage(page.pageId, "example-entity")
                      }
                    >
                      Open Example
                    </Button>
                  </Box>
                </ListItem>
                {index < registeredPages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Dynamic Loading"
                secondary="Pages are loaded dynamically using React.lazy for better performance"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Unique Entity IDs"
                secondary="Each page instance can have a unique entity ID for data isolation"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Input Models"
                secondary="Pages can receive input data models for initialization"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Route-based Access"
                secondary="Pages can be accessed directly via URL routes: /page/pageType/entityId"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Registry System"
                secondary="Centralized page registry for easy management and discovery"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PageDemo;
