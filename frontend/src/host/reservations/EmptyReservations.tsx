import { Stack, Box, Typography, Button, Zoom } from "@mui/material";

export function EmptyReservations() {
  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Zoom in>
        <Box
          component="img"
          src="/images/no-reservations.png"
          alt="No reservations"
          sx={{
            width: 300,
            bgcolor: "grey.100",
            objectFit: "contain",
            userSelect: "none",
          }}
        />
      </Zoom>
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            letterSpacing: -0.8,
            fontSize: {
              xs: "1.8rem",
              sm: "2.2rem",
            },
            maxWidth: 420,
            mx: "auto",
          }}
        >
          You don’t have any reservations
        </Typography>

        <Typography
          color="text.secondary"
          sx={{
            mt: 1.5,
            maxWidth: 400,
            mx: "auto",
            fontSize: "1rem",
          }}
        >
          Once guests book one of your listings, their reservation will show up
          here.
        </Typography>
      </Box>
      <Button
        variant="contained"
        href="/host"
        sx={{
          mt: 1,
          px: 3,
          py: 1.2,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Complete your listing
      </Button>
    </Stack>
  );
}
