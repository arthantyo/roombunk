import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import HomeSearch from "./search/HomeSearch";
import GuestMobileNavigation from "./GuestMobileNavigation";
import HostMobileNavigation from "./HostMobileNavigation";
import Header from "./Header";

export default function Layout() {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isHostMode = location.pathname.startsWith("/host");

  const isMessagesPage =
    location.pathname.startsWith("/host/messages") ||
    location.pathname.startsWith("/messages");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f7f7f5",
      }}
    >
      <Header />

      {isHomePage && <HomeSearch />}

      <Box
        component="main"
        sx={{
          width: "100%",
          px: isMessagesPage ? 0 : { xs: 2, md: 3 },
          pb: isMessagesPage ? 0 : isHostMode ? 10 : 6,
        }}
      >
        {isMessagesPage ? (
          <Outlet />
        ) : (
          <Container maxWidth="xl" disableGutters sx={{ mx: "auto" }}>
            <Outlet />
          </Container>
        )}
      </Box>

      {isHostMode ? <HostMobileNavigation /> : <GuestMobileNavigation />}
    </Box>
  );
}
