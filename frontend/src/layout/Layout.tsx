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
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";
import HomeSearch from "./search/HomeSearch";
import { Favorite, HomeFilled } from "@mui/icons-material";

export default function Layout() {
  const { isAuthenticated, user, logout, openAuthModal } = useAuth();
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
            width: "100%",
            px: { xs: 3, md: 6 },
            minHeight: 84,
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#0f6f5c",
              fontWeight: 800,
              gap: 0.1,
              flexGrow: 1,
            }}
          >
            <Box
              component="img"
              src="/images/face.png"
              alt="Roombunk.nl Logo"
              sx={{
                width: 34,
                height: 34,
                objectFit: "contain",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, letterSpacing: -0.6 }}
            >
              Roombunk.nl
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
              to="/wishlists"
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <Favorite fontSize="small" />
              </ListItemIcon>
              <ListItemText>Wishlist</ListItemText>
            </MenuItem>
            <MenuItem
              component={RouterLink}
              to="/reservations"
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <HomeFilled fontSize="small" />
              </ListItemIcon>
              <ListItemText>Trips</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 0.5, borderColor: "#eceae5" }} />
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
              onClick={() => {
                closeAccountMenu();
                openAuthModal("login");
              }}
            >
              <ListItemIcon>
                <LoginIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign in</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeAccountMenu();
                openAuthModal("register");
              }}
            >
              <ListItemIcon>
                <PersonAddAlt1Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Create account</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>

      {isHomePage && <HomeSearch />}

      <Box component="main" sx={{ width: "100%", px: { xs: 2, md: 3 }, pb: 6 }}>
        <Container maxWidth="xl" disableGutters sx={{ mx: "auto" }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
