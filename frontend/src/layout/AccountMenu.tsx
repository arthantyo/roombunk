import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import {
  Apartment,
  ChatBubble,
  CollectionsBookmark,
  Favorite,
  HomeFilled,
  HomeWork,
  TravelExplore,
} from "@mui/icons-material";

import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/useAuth";

type AccountMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  isHostMode: boolean;
};

export default function AccountMenu({
  anchorEl,
  onClose,
  isHostMode,
}: AccountMenuProps) {
  const navigate = useNavigate();

  const { isAuthenticated, logout, openAuthModal } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const handleLogin = () => {
    onClose();
    openAuthModal("login");
  };

  const handleRegister = () => {
    onClose();
    openAuthModal("register");
  };

  return (
    <Menu
      id="account-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
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
        isHostMode ? (
          <>
            <MenuItem
              component={RouterLink}
              to="/host/listings"
              onClick={onClose}
            >
              <ListItemIcon>
                <Apartment fontSize="small" />
              </ListItemIcon>

              <ListItemText>Listings</ListItemText>
            </MenuItem>

            <MenuItem component={RouterLink} to="/host/" onClick={onClose}>
              <ListItemIcon>
                <CollectionsBookmark fontSize="small" />
              </ListItemIcon>

              <ListItemText>Reservations</ListItemText>
            </MenuItem>

            <MenuItem
              component={RouterLink}
              to="/host/messages"
              onClick={onClose}
            >
              <ListItemIcon>
                <ChatBubble fontSize="small" />
              </ListItemIcon>

              <ListItemText>Messages</ListItemText>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem component={RouterLink} to="/wishlists" onClick={onClose}>
              <ListItemIcon>
                <Favorite fontSize="small" />
              </ListItemIcon>

              <ListItemText>Wishlist</ListItemText>
            </MenuItem>

            <MenuItem
              component={RouterLink}
              to="/reservations"
              onClick={onClose}
            >
              <ListItemIcon>
                <HomeFilled fontSize="small" />
              </ListItemIcon>

              <ListItemText>Trips</ListItemText>
            </MenuItem>

            <MenuItem component={RouterLink} to="/messages" onClick={onClose}>
              <ListItemIcon>
                <ChatBubble fontSize="small" />
              </ListItemIcon>

              <ListItemText>Messages</ListItemText>
            </MenuItem>
          </>
        )
      ) : (
        <>
          <MenuItem onClick={handleLogin}>
            <ListItemIcon>
              <LoginIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText>Sign in</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleRegister}>
            <ListItemIcon>
              <PersonAddAlt1Icon fontSize="small" />
            </ListItemIcon>

            <ListItemText>Create account</ListItemText>
          </MenuItem>
        </>
      )}

      <Divider
        sx={{
          my: 0.5,
          borderColor: "#eceae5",
        }}
      />

      {isHostMode ? (
        <MenuItem component={RouterLink} to="/" onClick={onClose}>
          <ListItemIcon>
            <TravelExplore fontSize="small" />
          </ListItemIcon>

          <ListItemText>Find a place</ListItemText>
        </MenuItem>
      ) : (
        <MenuItem component={RouterLink} to="/host" onClick={onClose}>
          <ListItemIcon>
            <HomeWork fontSize="small" />
          </ListItemIcon>

          <ListItemText>Become a host</ListItemText>
        </MenuItem>
      )}

      {isAuthenticated && (
        <>
          <Divider
            sx={{
              my: 0.5,
              borderColor: "#eceae5",
            }}
          />

          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText>Log out</ListItemText>
          </MenuItem>
        </>
      )}
    </Menu>
  );
}
