import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { Stripe, StripePaymentElementOptions } from "@stripe/stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { createPaymentIntent } from "../api/payments";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;
const stripePromise: Promise<Stripe | null> | null = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null;

interface CheckoutState {
  holdToken: string;
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  hotelName?: string;
  roomType?: string;
  pricePerNight?: number;
  nights?: number;
}

function OrderSummary({ state }: { state: CheckoutState }) {
  const total = (state.pricePerNight ?? 0) * (state.nights ?? 0);
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <Stack spacing={1}>
          {state.hotelName && (
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {state.hotelName}
            </Typography>
          )}
          {state.roomType && (
            <Typography variant="body2" color="text.secondary">
              {state.roomType}
            </Typography>
          )}
          <Typography variant="body2">
            {state.checkInDate} &rarr; {state.checkOutDate}
          </Typography>
          <Divider />
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2">
              ${state.pricePerNight?.toFixed(2)} &times; {state.nights} night(s)
            </Typography>
            <Typography variant="body2">${total.toFixed(2)}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function PaymentForm({ state }: { state: CheckoutState }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: StripePaymentElementOptions = { layout: "tabs" };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <PaymentElement options={options} />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!stripe || submitting}
        sx={{ mt: 3 }}
      >
        {submitting
          ? "Processing..."
          : `Pay $${((state.pricePerNight ?? 0) * (state.nights ?? 0)).toFixed(2)}`}
      </Button>
    </Box>
  );
}

function PaymentStatus() {
  const [status, setStatus] = useState<
    "loading" | "succeeded" | "processing" | "failed"
  >("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );
    if (!clientSecret || !stripePromise) {
      setStatus("failed");
      return;
    }

    stripePromise.then((stripe) => {
      if (!stripe) {
        setStatus("failed");
        return;
      }
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === "succeeded") {
          setStatus("succeeded");
        } else if (paymentIntent?.status === "processing") {
          setStatus("processing");
        } else {
          setStatus("failed");
        }
      });
    });
  }, []);

  if (status === "loading") {
    return (
      <Stack spacing={2} sx={{ mt: 8, alignItems: "center" }}>
        <CircularProgress />
        <Typography>Confirming your payment...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} sx={{ mt: 8, alignItems: "center" }}>
      {status === "succeeded" && (
        <>
          <Alert severity="success">
            Payment received! Your reservation is being confirmed.
          </Alert>
          <Button variant="contained" onClick={() => navigate("/reservations")}>
            View my trips
          </Button>
        </>
      )}
      {status === "processing" && (
        <Alert severity="info">Your payment is processing.</Alert>
      )}
      {status === "failed" && (
        <>
          <Alert severity="error">We couldn't confirm your payment.</Alert>
          <Button variant="outlined" onClick={() => navigate("/")}>
            Back to explore
          </Button>
        </>
      )}
    </Stack>
  );
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as CheckoutState | null;
  const isReturning = new URLSearchParams(window.location.search).has(
    "payment_intent_client_secret",
  );

  useEffect(() => {
    if (isReturning || !state) return;

    createPaymentIntent({
      hotelId: state.hotelId,
      roomId: state.roomId,
      checkInDate: state.checkInDate,
      checkOutDate: state.checkOutDate,
      holdToken: state.holdToken,
    })
      .then((res) => setClientSecret(res.clientSecret))
      .catch(() =>
        setError("Unable to start checkout. Your room hold may have expired."),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturning]);

  if (isReturning) {
    return <PaymentStatus />;
  }

  if (!state) {
    return (
      <Alert severity="warning">
        No booking in progress. Please select a room to book from a hotel page.
      </Alert>
    );
  }

  if (!stripePromise) {
    return (
      <Alert severity="error">
        Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY.
      </Alert>
    );
  }

  if (error) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ alignSelf: "flex-start" }}
        >
          Go back
        </Button>
      </Stack>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <OrderSummary state={state} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm state={state} />
            </Elements>
          ) : (
            <Stack sx={{ py: 6, alignItems: "center" }}>
              <CircularProgress />
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
