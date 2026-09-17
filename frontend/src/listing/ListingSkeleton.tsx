import { Box, Divider, Skeleton } from "@mui/material";

export default function ListingSkeleton() {
  return (
    <Box sx={{ maxWidth: 1280, mx: "auto", px: { xs: 1.5, md: 3 }, py: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          my: 2.5,
        }}
      >
        <Skeleton variant="text" width="min(420px, 70%)" height={58} />
        <Skeleton variant="rounded" width={82} height={40} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.55fr 1fr" },
          gridTemplateRows: {
            xs: "clamp(240px, 78vw, 520px)",
            md: "clamp(420px, 42vw, 560px)",
          },
          gap: 1.2,
          mb: 3,
        }}
      >
        <Skeleton
          variant="rounded"
          sx={{
            height: "100%",
            borderRadius: { xs: "1.5rem", md: "3em 0 0 3rem" },
          }}
        />
        <Box
          sx={{
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.2,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" sx={{ height: "100%" }} />
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.8fr) minmax(260px, 1fr)",
          },
          gap: { xs: 3, md: 12 },
        }}
      >
        <Box>
          <Skeleton variant="text" width="min(520px, 90%)" height={48} />
          <Skeleton variant="text" width="220px" height={30} />
          <Skeleton variant="text" width="100%" height={30} />
          <Skeleton variant="text" width="85%" height={30} />
          <Divider sx={{ mt: 2, mb: 3 }} />
          <Skeleton variant="text" width="min(520px, 90%)" height={48} />
          <Skeleton variant="text" width="220px" height={30} />
          <Skeleton variant="text" width="100%" height={30} />
          <Skeleton variant="text" width="85%" height={30} />
        </Box>
        <Skeleton variant="rounded" height={360} sx={{ borderRadius: 3 }} />
      </Box>
      <Divider sx={{ my: 4 }} />
      <Skeleton variant="text" width="180px" height={42} />
      <Skeleton variant="rounded" height={140} sx={{ mt: 1 }} />
    </Box>
  );
}
