import {
  Link as RouterLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LogoutIcon from "@mui/icons-material/Logout";
import HotelIcon from "@mui/icons-material/Hotel";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
  const isHomePage = location.pathname === "/";

  const openAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchor(event.currentTarget);
  };

  const closeAccountMenu = () => {
    setAccountAnchor(null);
  };

  function handleLogout() {
    logout();
    closeAccountMenu();
    navigate("/");
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#f7f7f5" }}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          background: "#f7f7f5",
          borderBottom: "1px solid #eceae5",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            maxWidth: 1400,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 3 },
            minHeight: 84,
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "#0f6f5c",
              fontWeight: 800,
              flexGrow: 1,
            }}
          >
            <HolidayVillageIcon sx={{ fontSize: 28 }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, letterSpacing: -0.6 }}
            >
              Airbonk
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{ width: 28, height: 28, fontSize: 12, bgcolor: "#0f6f5c" }}
            >
              {user?.email ? user.email.charAt(0).toUpperCase() : ""}
            </Avatar>
            <Button
              aria-controls={accountAnchor ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={accountAnchor ? "true" : undefined}
              onClick={openAccountMenu}
              variant="outlined"
              sx={{
                minWidth: 0,
                px: 0.8,
                py: 0.8,
                borderRadius: 999,
                borderColor: "#dddddd",
                color: "#222222",
                textTransform: "none",
                background: "#ffffff",
              }}
            >
              <MenuIcon fontSize="small" />
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        id="account-menu"
        anchorEl={accountAnchor}
        open={Boolean(accountAnchor)}
        onClose={closeAccountMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 3,
              boxShadow: "0 18px 38px rgba(0,0,0,0.12)",
              border: "1px solid #eceae5",
              p: 1,
            },
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <MenuItem
              component={RouterLink}
              to="/reservations"
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <HotelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My trips</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Log out</ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              component={RouterLink}
              to="/login"
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign in</ListItemText>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/register"
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <PersonAddAlt1Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create account</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {isHomePage && (
        <Container
          maxWidth={false}
          disableGutters
          sx={{
            px: { xs: 2, md: 3 },
            pb: 3,
          }}
        >
          <Box
            sx={{
              maxWidth: 1160,
              mx: "auto",
              mt: 4,
              borderRadius: 999,
              border: "1px solid #e2e1df",
              background: "rgba(255,255,255,0.72)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.05)",
              backdropFilter: "blur(4px)",
              overflow: "hidden",
            }}
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              sx={{ alignItems: "stretch" }}
            >
              {[
                { label: "Where", placeholder: "Search destinations" },
                { label: "When", placeholder: "Add dates" },
                { label: "Who", placeholder: "Add guests" },
              ].map((field) => (
                <Box
                  key={field.label}
                  sx={{
                    flex: 1,
                    borderRight: { lg: "1px solid #ebebeb" },
                    px: { xs: 2, md: 3 },
                    py: { xs: 1.5, md: 1.8 },
                    minHeight: 72,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, color: "#222222", mb: 0.35 }}
                  >
                    {field.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    {field.placeholder}
                  </Typography>
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 1.5,
                  py: 1.5,
                }}
              >
                <IconButton
                  sx={{
                    width: 52,
                    height: 52,
                    background: "#0f6f5c",
                    color: "#fff",
                    borderRadius: "50%",
                    ":hover": {
                      background: "#0f6f5c",
                    },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </Stack>
          </Box>
        </Container>
      )}

      <Box component="main" sx={{ width: "100%", px: { xs: 2, md: 3 }, pb: 6 }}>
        <Container maxWidth="xl" disableGutters sx={{ mx: "auto" }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
