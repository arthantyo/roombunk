import { Box, Button, Typography } from "@mui/material";

type Props = {
  propertyName: string;
  roomType: string;
  onHome: () => void;
};

export default function HostingSuccess({
  propertyName,
  roomType,
  onHome,
}: Props) {
  return (
    <Box
      sx={{
        maxWidth: 640,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 8,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 500, mb: 2 }}>
        Your listing is live!
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {propertyName} has been created with a {roomType.toLowerCase()} listing.
      </Typography>

      <Button variant="contained" onClick={onHome}>
        Go to home
      </Button>
    </Box>
  );
}
