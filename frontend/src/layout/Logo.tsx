import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

type LogoProps = {
  isHostMode: boolean;
};

export default function Logo({ isHostMode }: LogoProps) {
  return (
    <Box
      component={RouterLink}
      to={isHostMode ? "/host" : "/"}
      sx={{
        display: "flex",
        alignItems: "center",
        textDecoration: "none",
        color: "#0f6f5c",
        fontWeight: 800,
        gap: 0.1,
        flex: 1,
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
        sx={{
          fontWeight: 500,
          letterSpacing: -0.6,
        }}
      >
        Roombunk.nl
      </Typography>
    </Box>
  );
}
