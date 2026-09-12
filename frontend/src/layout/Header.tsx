import { useState } from "react";
import { AppBar, Avatar, Button, Stack, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";

import { useAuth } from "../auth/useAuth";
import Logo from "./Logo";
import HostNavigation from "./HostNavigation";
import AccountMenu from "./AccountMenu";

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);

  const isHostMode = location.pathname.startsWith("/host");

  const openAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchor(event.currentTarget);
  };

  const closeAccountMenu = () => {
    setAccountAnchor(null);
  };

  return (
    <>
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
            position: "relative",
          }}
        >
          <Logo isHostMode={isHostMode} />

          {isHostMode && <HostNavigation />}

          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: "center",
              justifyContent: "flex-end",
              flex: 1,
            }}
          >
            {isAuthenticated && (
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: 12,
                  bgcolor: "#0f6f5c",
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
            )}

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

      <AccountMenu
        anchorEl={accountAnchor}
        onClose={closeAccountMenu}
        isHostMode={isHostMode}
      />
    </>
  );
}
