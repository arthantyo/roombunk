import { ButtonBase, Box, Typography, Zoom } from "@mui/material";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
        py: 4,
        px: 2,
      }}
    >
      <Zoom in>
        <Box
          component="img"
          src="/images/not-found.png"
          alt="Page not found"
          sx={{
            display: "block",
            width: "100%",
            maxWidth: "500px",
            height: "auto",
            mx: "auto",
          }}
        />
      </Zoom>
      <Typography
        variant="h2"
        sx={{ textAlign: "center", mt: 2, fontWeight: 600 }}
      >
        Bunky is lost!
      </Typography>
      <Typography variant="h5" sx={{ textAlign: "center", mt: 1 }}>
        Oops! The page you're looking for does not exist.
      </Typography>
      <ButtonBase
        href="/"
        sx={{
          mt: 3,
          px: 3,
          py: 2,
          backgroundColor: "#0f6f5c",
          color: "#fff",
          borderRadius: 20,
          "&:hover": {
            backgroundColor: "#0d5e4c",
          },
        }}
      >
        Return home
      </ButtonBase>
    </Box>
  );
}
