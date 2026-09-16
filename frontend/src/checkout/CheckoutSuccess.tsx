import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {
  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: 3, py: 10, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Payment submitted
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Your payment was sent to Stripe. Your reservation will appear after
        Stripe confirms the payment.
      </Typography>
      <Button component={Link} to="/reservations" variant="contained">
        View reservations
      </Button>
    </Box>
  );
}
