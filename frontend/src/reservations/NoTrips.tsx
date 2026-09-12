import { Box, Typography, Zoom } from "@mui/material";

export function NoTrips() {
  return (
    <Box
      sx={{
        minHeight: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Zoom in>
        <Box
          component="img"
          src="/images/no-trips.png"
          alt="No trips"
          sx={{
            width: "100%",
            maxWidth: 380,
            height: "auto",
            mb: 3,
          }}
        />
      </Zoom>

      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        No trips yet
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 500,
        }}
      >
        When you book a stay, your trips will appear here.
      </Typography>
    </Box>
  );
}
