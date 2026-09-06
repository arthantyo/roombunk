import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
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
    <div>
      <h2>404 Error</h2>
      <p>Oops! The page you're looking for does not exist.</p>
    </div>
  );
};
export default App;
