import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Box,
  ButtonBase,
  CssBaseline,
  ThemeProvider,
  Typography,
  Zoom,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import theme from "./theme";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Layout from "./layout/Layout";
import Home from "./home/Home.tsx";
import Hotel from "./hotel/Hotel.tsx";
import Checkout from "./checkout/Checkout.tsx";
import Reservations from "./reservations/Reservations.tsx";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/hotels/:id" element={<Hotel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/reservations" element={<Reservations />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const PageNotFound = () => {
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
};
export default App;
