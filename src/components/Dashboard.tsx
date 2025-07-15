import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../services/useAuth";
import TokenDemo from "./TokenDemo";
import { FormDemo } from "./FormDemo";
import { ToastDemo } from "./ToastDemo";
import { TokenRefreshDemo } from "./TokenRefreshDemo";
import { TokenRefreshTroubleshooting } from "./TokenRefreshTroubleshooting";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import FormRouteDemo from "./FormRouteDemo";

const drawerWidth = 220;

const ProfilePage: React.FC<{ user: any }> = ({ user }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      Welcome to Keystone!
    </Typography>
    <Typography variant="body1" gutterBottom>
      You have successfully authenticated with Microsoft Entra ID.
    </Typography>
    <Box
      sx={{
        mt: 2,
        p: 2,
        border: "1px solid #eee",
        borderRadius: 2,
        bgcolor: "#fafafa",
      }}
    >
      <Typography variant="h6">Your Profile</Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        Name: {user?.name || "Not available"}
      </Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        Email: {user?.username}
      </Typography>
      <Typography sx={{ fontWeight: "bold" }}>
        Account ID: {user?.homeAccountId}
      </Typography>
    </Box>
  </Box>
);

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { text: "Profile", path: "/profile" },
    { text: "Tokens", path: "/tokens" },
    { text: "Token Refresh", path: "/token-refresh" },
    { text: "Token Troubleshooting", path: "/token-troubleshooting" },
    { text: "Forms Demo", path: "/forms" },
    { text: "Toast Demo", path: "/toasts" },
    { text: "Form Route Demo", path: "/form/buttonDemoForm/preview" }, // Add demo page to menu
  ];

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ pl: 0 }}>
            <Typography
              variant="h6"
              sx={{ flexGrow: 0, textAlign: "left", minWidth: 0 }}
            >
              Keystone Dashboard
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              color="inherit"
              component={RouterLink}
              to="/profile"
              startIcon={
                <Avatar
                  sx={{
                    bgcolor: deepPurple[500],
                    width: 28,
                    height: 28,
                    fontSize: 16,
                  }}
                >
                  {user?.name?.[0] || user?.username?.[0] || "?"}
                </Avatar>
              }
              aria-label="Show Profile"
            >
              {user?.name || user?.username}
            </Button>
            <Button color="inherit" onClick={logout} sx={{ ml: 2 }}>
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              pt: 8,
              top: 64,
              height: "calc(100% - 64px)",
              overflowY: "hidden", // Prevent vertical scroll on drawer
            },
          }}
        >
          <Box sx={{ overflow: "hidden", height: "100%" }}>
            <List>
              {navItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton component={RouterLink} to={item.path}>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            mt: 8,
            height: "calc(100vh - 64px)",
          }}
        >
          <Box sx={{ flex: 1, overflow: "auto", height: "100%" }}>
            <Routes>
              <Route path="/profile" element={<ProfilePage user={user} />} />
              <Route path="/tokens" element={<TokenDemo />} />
              <Route path="/token-refresh" element={<TokenRefreshDemo />} />
              <Route
                path="/token-troubleshooting"
                element={<TokenRefreshTroubleshooting />}
              />
              <Route path="/forms" element={<FormDemo />} />
              <Route path="/toasts" element={<ToastDemo />} />
              <Route
                path="/form/:formType/:formEntityId"
                element={<FormRouteDemo />}
              />
              <Route path="*" element={<Navigate to="/profile" replace />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default Dashboard;
