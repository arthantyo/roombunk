import { ButtonBase, Box, Typography, Zoom } from "@mui/material";

export default function PageNotFound() {
  return (
    <Box
      sx={{
        minHeight: {
          xs: "calc(100vh - 84px - 72px)",
          md: "calc(100vh - 84px)",
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 3,
        textAlign: "center",
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
            maxWidth: {
              xs: 340,
              sm: 420,
              md: 500,
            },
            height: "auto",
          }}
        />
      </Zoom>

      <Typography
        variant="h2"
        sx={{
          mt: 2,
          fontWeight: 600,
          fontSize: {
            xs: "2.2rem",
            sm: "3rem",
            md: "3.75rem",
          },
        }}
      >
        Bunky is lost!
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 1,
          fontSize: {
            xs: "1rem",
            sm: "1.25rem",
          },
        }}
      >
        Oops! The page you're looking for does not exist.
      </Typography>

      <ButtonBase
        href="/"
        sx={{
          mt: 3,
          px: 3,
          py: 1.5,
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
