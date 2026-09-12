import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function HostingSuccessListing() {
  return (
    <Box
      sx={{
        maxWidth: 720,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 8,
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src="/images/new-listing.png"
        alt="Listing live"
        sx={{
          width: 300,
          bgcolor: "grey.100",
          objectFit: "contain",
          userSelect: "none",
          mb: 3,
        }}
      />

      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Your listing is live!
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You can go to your listing to make further edits or view it live.
      </Typography>

      <Button
        component={RouterLink}
        to="/host"
        variant="contained"
        sx={{
          bgcolor: "#0f6f5c",
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1.2,
          borderRadius: 2,
          "&:hover": {
            bgcolor: "#0c5c4c",
          },
        }}
      >
        Back to hosting
      </Button>
    </Box>
  );
}
