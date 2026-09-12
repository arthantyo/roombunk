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
import PageNotFound from "./layout/PageNotFound";
import Wishlist from "./wishlist/Wishlist.tsx";
import Precheckout from "./precheckout/Precheckout.tsx";
import Hosting from "./host/listings/HostListings.tsx";
import HostListingDetail from "./host/listings/id/HostListingDetail.tsx";
import Host from "./host/Host.tsx";
import HotelReservations from "./host/reservations/HostReservations.tsx";
import HostMessages from "./host/messages/HostMessages.tsx";
import GuestMessages from "./messages/GuestMessage.tsx";

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
                <Route path="/wishlists" element={<Wishlist />} />
                <Route path="/book/:id" element={<Precheckout />} />
                <Route path="/messages" element={<GuestMessages />} />

                <Route path="/host" element={<HotelReservations />} />
                <Route path="/host/create" element={<Hosting />} />
                <Route path="/host/listings" element={<Host />} />
                <Route
                  path="/host/listing/:id"
                  element={<HostListingDetail />}
                />
                <Route
                  path="/host/listings/:id"
                  element={<HostListingDetail />}
                />
                <Route path="/host/messages" element={<HostMessages />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
