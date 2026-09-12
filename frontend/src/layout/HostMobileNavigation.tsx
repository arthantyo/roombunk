import { ChatBubble, HomeOutlined, ListAltOutlined } from "@mui/icons-material";

import { Box, Button, Typography } from "@mui/material";

import { Link as RouterLink, useLocation } from "react-router-dom";

const items = [
  {
    label: "Today",
    to: "/host",
    icon: HomeOutlined,
    isActive: (pathname: string) => pathname === "/host",
  },
  {
    label: "Listings",
    to: "/host/listings",
    icon: ListAltOutlined,
    isActive: (pathname: string) => pathname.startsWith("/host/listing"),
  },
  {
    label: "Messages",
    to: "/host/messages",
    icon: ChatBubble,
    isActive: (pathname: string) => pathname.startsWith("/host/messages"),
  },
];

export default function HostMobileNavigation() {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        bgcolor: "#fff",
        borderTop: "1px solid #eceae5",
        zIndex: 1200,
        justifyContent: "space-around",
        alignItems: "center",
        px: 1,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.isActive(pathname);

        return (
          <Button
            key={item.to}
            component={RouterLink}
            to={item.to}
            sx={{
              minWidth: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.3,
              textTransform: "none",
              color: active ? "#0f6f5c" : "text.secondary",
            }}
          >
            <Icon fontSize="small" />

            <Typography variant="caption">{item.label}</Typography>
          </Button>
        );
      })}
    </Box>
  );
}
