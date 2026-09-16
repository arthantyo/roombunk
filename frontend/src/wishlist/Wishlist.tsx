import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
  Zoom,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import {
  getMyWishlistGroups,
  getMyWishlists,
  removeWishlistGroup,
} from "../api/wishlists";
import { Error } from "../common/Error";
import { CloseRounded } from "@mui/icons-material";

export default function Wishlist() {
  const queryClient = useQueryClient();

  const {
    data: wishlists = [],
    isLoading: wishlistsLoading,
    isError: wishlistsError,
  } = useQuery({
    queryKey: ["myWishlist"],
    queryFn: getMyWishlists,
  });

  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
  } = useQuery({
    queryKey: ["wishlist-groups"],
    queryFn: getMyWishlistGroups,
  });

  const removeGroupMutation = useMutation({
    mutationFn: removeWishlistGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist-groups"] });
    },
  });

  const isLoading = wishlistsLoading || groupsLoading;
  const isError = wishlistsError || groupsError;

  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: 2,
    mt: 4,
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
        Wishlists
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
      {!isLoading && !isError && groups.length === 0 && (
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

      {!isLoading && !isError && groups.length > 0 && (
        <Box sx={gridSx}>
          {groups.map((group) => {
            const groupWishlists = wishlists.filter(
              (wishlist) => wishlist.group.id === group.id,
            );
            const previewListing = groupWishlists[0]?.listing;

            return (
              <Card
                key={group.id}
                component={RouterLink}
                to={`/wishlists/${group.id}`}
                sx={{
                  minWidth: 0,
                  background: "transparent",
                  boxShadow: "none",
                  textDecoration: "none",
                  color: "inherit",
                  position: "relative",

                  "& .delete-button": {
                    opacity: 0,
                    transition: "opacity 0.2s",
                  },

                  "&:hover .delete-button": {
                    opacity: 1,
                  },
                }}
              >
                <IconButton
                  className="delete-button"
                  onClick={(e) => {
                    // Prevent clicking the X from navigating to the wishlist
                    e.preventDefault();
                    e.stopPropagation();

                    removeGroupMutation.mutate(group.id);
                  }}
                  sx={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    zIndex: 2,
                    bgcolor: "background.paper",
                    boxShadow: 1,

                    "&:hover": {
                      bgcolor: "background.paper",
                    },
                  }}
                  size="small"
                >
                  <CloseRounded fontSize="medium" />
                </IconButton>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: 3,
                    overflow: "hidden",
                    backgroundColor: "grey.200",
                  }}
                >
                  {previewListing ? (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        width: "100%",
                        height: "100%",
                        gap: "4px",
                      }}
                    >
                      {[
                        "apartment-stock.png",
                        "hotel-stock.png",
                        "studio-stock.png",
                        "apartment-stock.png",
                      ].map((image, index) => (
                        <CardMedia
                          key={`${group.id}-${index}`}
                          component="img"
                          image={`/images/${image}`}
                          alt={index === 0 ? previewListing.title : ""}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ width: "100%", height: "100%" }} />
                  )}
                </Box>
                <Typography sx={{ mt: 1, fontWeight: 600 }} noWrap>
                  {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {groupWishlists.length} saved
                </Typography>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
