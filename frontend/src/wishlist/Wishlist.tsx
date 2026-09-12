import { useQuery } from "@tanstack/react-query";
import { Box, Skeleton, Typography, Zoom } from "@mui/material";
import { getMyWishlists } from "../api/wishlists";
import { Error } from "../common/Error";

export default function Wishlist() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["myWishlist"],
    queryFn: getMyWishlists,
  });

  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      sm: "repeat(3, minmax(0, 1fr))",
      md: "repeat(4, minmax(0, 1fr))",
    },
    gap: 2,
    mt: 3,
  };

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 500,
          mt: 5,
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        Wishlist
      </Typography>

      {isError && <Error />}

      {isLoading && (
        <Box sx={gridSx}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Box key={i}>
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height="100%"
                  sx={{
                    borderRadius: 2,
                  }}
                />
              </Box>

              <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
            </Box>
          ))}
        </Box>
      )}
      {!isLoading && data?.length === 0 && (
        <Box
          sx={{
            minHeight: 420,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 2,
          }}
        >
          <Zoom in>
            <Box
              component="img"
              src="/images/no-wishlists.png"
              alt="No wishlists"
              sx={{
                width: "100%",
                maxWidth: 260,
                height: "auto",
                mb: 3,
              }}
            />
          </Zoom>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            No wishes yet
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 1,
              maxWidth: 500,
            }}
          >
            When you add a wish, it will appear here.
          </Typography>
        </Box>
      )}

      {/* <Box sx={gridSx}>
        <Box>
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: "grey.300",
              borderRadius: 2,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            <History sx={{ fontSize: { xs: 40, sm: 60 }, color: "grey.600" }} />
          </Box>

          <Typography
            sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Recently viewed
          </Typography>
        </Box>

        <Box>
          <Box
            sx={{
              width: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: "grey.300",
              borderRadius: 2,
            }}
          />

          <Typography
            sx={{ mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            Asiatour 2027
          </Typography>
        </Box>
      </Box> */}
    </Box>
  );
}
