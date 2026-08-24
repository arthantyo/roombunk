import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              flexGrow: 1,
            }}
          >
            <HolidayVillageIcon color="primary" />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              Staycay
            </Typography>
          </Box>
          {isAuthenticated ? (
            <>
              <Button component={RouterLink} to="/reservations" color="inherit">
                My Trips
              </Button>
              <Typography variant="body2" sx={{ mx: 2 }}>
                {user?.email}
              </Typography>
              <Button variant="outlined" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button component={RouterLink} to="/login" color="inherit">
                Sign in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{ ml: 1 }}
              >
                Sign up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
