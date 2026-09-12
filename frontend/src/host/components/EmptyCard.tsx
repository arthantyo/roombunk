import { HotelOutlined, Add } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function EmptyListings() {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <HotelOutlined
        sx={{
          fontSize: 48,
          color: "text.secondary",
          mb: 2,
        }}
      />

      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        You don't have any listings yet
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Create your first listing and start hosting guests.
      </Typography>

      <Button
        component={RouterLink}
        to="/hosting"
        variant="contained"
        startIcon={<Add />}
      >
        Create listing
      </Button>
    </Box>
  );
}
