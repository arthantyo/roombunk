import { Alert, Box, Button, Typography } from "@mui/material";

import { useState } from "react";
import { CheckoutStep } from "./CheckoutStep";

type StepId = "paymentTiming" | "paymentMethod" | "message" | "review";

type PrecheckoutStepsProps = {
  onReviewRequest?: () => Promise<void>;
};

export default function PrecheckoutSteps({
  onReviewRequest,
}: PrecheckoutStepsProps) {
  const [expanded, setExpanded] = useState<StepId | false>("paymentTiming");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [completed, setCompleted] = useState<Record<StepId, boolean>>({
    paymentTiming: false,
    paymentMethod: false,
    message: false,
    review: false,
  });

  function handleExpand(step: StepId) {
    setExpanded((current) => (current === step ? false : step));
  }

  function completeStep(step: StepId, nextStep?: StepId) {
    setCompleted((current) => ({
      ...current,
      [step]: true,
    }));

    setExpanded(nextStep ?? false);
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* STEP 1 */}
      <CheckoutStep
        number={1}
        title="Choose when to pay"
        subtitle={
          completed.paymentTiming
            ? "Payment timing selected"
            : "Select how you want to pay for your stay"
        }
        completed={completed.paymentTiming}
        expanded={expanded === "paymentTiming"}
        onChange={() => handleExpand("paymentTiming")}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "#0f6f5c",
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Pay now</Typography>

              <Typography
                sx={{
                  fontSize: "0.875rem",
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                Pay the full amount when you confirm the booking.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2.5,
            }}
          >
            <Button
              variant="contained"
              onClick={() => completeStep("paymentTiming", "paymentMethod")}
              sx={{
                bgcolor: "#0f6f5c",
                textTransform: "none",
                borderRadius: 2,

                "&:hover": {
                  bgcolor: "#0b5d4d",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </CheckoutStep>

      {/* STEP 2 */}
      <CheckoutStep
        number={2}
        title="Add a payment method"
        subtitle={
          completed.paymentMethod
            ? "Payment method added"
            : "Add a card or another payment method"
        }
        completed={completed.paymentMethod}
        expanded={expanded === "paymentMethod"}
        onChange={() => handleExpand("paymentMethod")}
      >
        <Box>
          <Box
            sx={{
              p: 2,
              border: "1px solid #dddddd",
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>Stripe</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2.5,
            }}
          >
            <Button
              variant="contained"
              onClick={() => completeStep("paymentMethod", "message")}
              sx={{
                bgcolor: "#0f6f5c",
                textTransform: "none",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#0b5d4d",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </CheckoutStep>

      {/* STEP 3 */}
      <CheckoutStep
        number={3}
        title="Write a message to the host"
        subtitle={
          completed.message
            ? "Message added"
            : "Introduce yourself and share any useful details"
        }
        completed={completed.message}
        expanded={expanded === "message"}
        onChange={() => handleExpand("message")}
      >
        <Box>
          <Box
            component="textarea"
            placeholder="Hi! I'm looking forward to staying..."
            sx={{
              width: "100%",
              minHeight: 130,
              resize: "vertical",
              p: 1.5,
              font: "inherit",
              boxSizing: "border-box",
              border: "1px solid #cccccc",
              borderRadius: 2,

              "&:focus": {
                outline: "2px solid #0f6f5c",
                outlineOffset: 1,
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              onClick={() => completeStep("message", "review")}
              sx={{
                mt: 2.5,
                bgcolor: "#0f6f5c",
                textTransform: "none",
                borderRadius: 2,

                "&:hover": {
                  bgcolor: "#0b5d4d",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </CheckoutStep>

      {/* STEP 4 */}
      <CheckoutStep
        number={4}
        title="Review request"
        subtitle="Check your booking details before continuing"
        completed={completed.review}
        expanded={expanded === "review"}
        onChange={() => handleExpand("review")}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "text.secondary",
              mb: 2,
            }}
          >
            By continuing, you agree to the booking and cancellation conditions.
          </Typography>

          <Button
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            onClick={async () => {
              if (isSubmitting) return;
              setSubmitError(null);
              setCompleted((current) => ({
                ...current,
                review: true,
              }));

              setIsSubmitting(true);
              try {
                await onReviewRequest?.();
              } catch (error) {
                setCompleted((current) => ({ ...current, review: false }));
                setSubmitError(
                  error instanceof Error
                    ? error.message
                    : "Unable to start checkout. Please try again.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            sx={{
              bgcolor: "#0f6f5c",
              py: 1.4,
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 500,

              "&:hover": {
                bgcolor: "#0b5d4d",
              },
            }}
          >
            {isSubmitting ? "Opening secure checkout..." : "Confirm and pay"}
          </Button>
          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </Box>
      </CheckoutStep>
    </Box>
  );
}
