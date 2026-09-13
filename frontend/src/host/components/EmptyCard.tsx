import { Box, Typography, Zoom } from "@mui/material";

export function EmptyListings() {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Zoom in>
        <Box
          component="img"
          src="/images/no-listing.png"
          alt="No listings"
          sx={{
            width: 260,
            mb: 2,
          }}
        />
      </Zoom>

      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        You don't have any listings yet
      </Typography>

      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Create your first listing and start hosting guests.
      </Typography>
    </Box>
  );
}
