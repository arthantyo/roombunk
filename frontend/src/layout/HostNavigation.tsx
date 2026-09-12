import { Button, Stack } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Today",
    to: "/host",
    isActive: (pathname: string) => pathname === "/host",
  },
  {
    label: "Listings",
    to: "/host/listings",
    isActive: (pathname: string) => pathname.startsWith("/host/listing"),
  },
  {
    label: "Messages",
    to: "/host/messages",
    isActive: (pathname: string) => pathname.startsWith("/host/messages"),
  },
];

export default function HostNavigation() {
  const { pathname } = useLocation();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        display: { xs: "none", md: "flex" },
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "center",
      }}
    >
      {navItems.map((item) => {
        const active = item.isActive(pathname);

        return (
          <Button
            key={item.to}
            component={RouterLink}
            to={item.to}
            sx={{
              color: active ? "#0f6f5c" : "text.secondary",
              fontWeight: active ? 700 : 500,
              textTransform: "none",
              fontSize: "0.95rem",
              borderBottom: active
                ? "2px solid #0f6f5c"
                : "2px solid transparent",
              borderRadius: 0,

              "&:hover": {
                background: "transparent",
                color: "#0f6f5c",
              },
            }}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
}
