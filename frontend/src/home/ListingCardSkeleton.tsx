import { Box, Skeleton } from "@mui/material";

export function ListingCardSkeleton() {
  return (
    <Box sx={{ minWidth: 0, width: "100%" }}>
      <Skeleton
        variant="rounded"
        sx={{
          display: "block",
          width: "100%",
          aspectRatio: "1 / 1",
          height: "auto",
          borderRadius: 4,
        }}
      />

      <Box sx={{ mt: 1.2, px: 0.5 }}>
        <Skeleton
          variant="text"
          width="78%"
          sx={{ fontSize: "1rem", lineHeight: 1.35 }}
        />

        <Skeleton
          variant="text"
          width="58%"
          sx={{ fontSize: "0.875rem", lineHeight: 1.43, mt: 0.2 }}
        />
      </Box>
    </Box>
  );
}
