import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "./useAuth";
import { ApiError } from "../api/client";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode?: "login" | "register";
  /** Optional custom image path for the left square area. Defaults to hotel background image. */
  imageSrc?: string;
}

export default function AuthModal({
  open,
  onClose,
  mode: initialMode = "login",
}: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  // Sync mode if initialMode changes when dialog opens
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
  }

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleToggleMode = (newMode: "login" | "register") => {
    setError(null);
    setMode(newMode);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      handleClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          mode === "login" && err.status === 401
            ? "Invalid email or password."
            : err.message,
        );
      } else {
        setError(
          "Something went wrong. Please check your details and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            maxWidth: 820,
            m: 2,
            position: "relative",
            boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
          },
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        aria-label="close"
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          zIndex: 10,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.95)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { md: 460 },
        }}
      >
        {/* Left side: Square Image container */}
        <Box
          sx={{
            width: { xs: "100%", md: "45%" },
            aspectRatio: { xs: "16/9", sm: "4/3", md: "1/1" },
            position: "relative",
            bgcolor: "#0f6f5c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={"/images/auth-cover.png"}
            alt="Auth background"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Overlay gradient for aesthetics */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 3,
              color: "#ffffff",
            }}
          ></Box>
        </Box>

        {/* Right side: Inputs & Form */}
        <Box
          sx={{
            width: { xs: "100%", md: "55%" },
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#ffffff",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#222222", mb: 0.5 }}
          >
            {mode === "login" ? "Welcome back" : "Create an account"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {mode === "login"
              ? "Please enter your details to sign in."
              : "Sign up to start booking your dream stays."}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <TextField
                label="Username"
                fullWidth
                required
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 1 }}
              />
            )}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.4,
                borderRadius: 999,
                bgcolor: "#0f6f5c",
                fontWeight: 500,
                fontSize: "0.95rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#0d5e4c",
                },
              }}
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 3, textAlign: "center", color: "#666666" }}
          >
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() => handleToggleMode("register")}
                  sx={{ color: "#0f6f5c", fontWeight: 600, cursor: "pointer" }}
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  onClick={() => handleToggleMode("login")}
                  sx={{ color: "#0f6f5c", fontWeight: 600, cursor: "pointer" }}
                >
                  Sign in
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}
