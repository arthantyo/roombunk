import { Box, Zoom, Typography } from "@mui/material";

export function Error() {
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
          src="/images/server-error.png"
          alt="Server error"
          sx={{
            width: "100%",
            maxWidth: 380,
            height: "auto",
            mb: 3,
          }}
        />
      </Zoom>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
        }}
      >
        Something unexpected happened.
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mt: 1,
          maxWidth: 500,
        }}
      >
        There was an error while loading your reservations. Please try again
        later.
      </Typography>
    </Box>
  );
}
