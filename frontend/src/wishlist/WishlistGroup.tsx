import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardMedia,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  getMyWishlistGroups,
  getMyWishlists,
  removeListingFromWishlist,
} from "../api/wishlists";
import { Error } from "../common/Error";

export default function WishlistGroup() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const groupId = Number(id);

  const { data: groups = [], isLoading: groupsLoading } = useQuery({
    queryKey: ["wishlist-groups"],
    queryFn: getMyWishlistGroups,
  });
  const {
    data: wishlists = [],
    isLoading: wishlistsLoading,
    isError,
  } = useQuery({
    queryKey: ["myWishlist"],
    queryFn: getMyWishlists,
  });

  const removeMutation = useMutation({
    mutationFn: removeListingFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myWishlist"] });
    },
  });

  const group = groups.find((item) => item.id === groupId);
  const groupWishlists = wishlists.filter(
    (wishlist) => wishlist.group.id === groupId,
  );
  const isLoading = groupsLoading || wishlistsLoading;
  const gridSx = {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(2, minmax(0, 1fr))",
      sm: "repeat(3, minmax(0, 1fr))",
      md: "repeat(4, minmax(0, 1fr))",
    },
    gap: 2,
    mt: 4,
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 } }}>
      <Typography
        component={RouterLink}
        to="/wishlists"
        sx={{
          display: "inline-block",
          mt: 5,
          color: "text.secondary",
          textDecoration: "none",
        }}
      >
        Back to wishlists
      </Typography>
      <Typography
        variant="h4"
        sx={{ mt: 2, fontWeight: 500, fontSize: { xs: "1.5rem", sm: "2rem" } }}
      >
        {group?.name ?? "Wishlist"}
      </Typography>

      {isError && <Error />}
      {isLoading && (
        <Box sx={gridSx}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" sx={{ aspectRatio: "1" }} />
          ))}
        </Box>
      )}
      {!isLoading && !isError && groupWishlists.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 8, textAlign: "center" }}>
          This wishlist is empty.
        </Typography>
      )}
      {!isLoading && !isError && groupWishlists.length > 0 && (
        <Box sx={gridSx}>
          {groupWishlists.map((wishlist) => (
            <Card
              key={wishlist.id}
              component={RouterLink}
              to={`/listings/${wishlist.listing.id}`}
              sx={{
                minWidth: 0,
                position: "relative",
                background: "transparent",
                boxShadow: "none",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <CardMedia
                component="img"
                image="/images/apartment-stock.png"
                alt={wishlist.listing.title}
                sx={{ aspectRatio: "1", borderRadius: 3, objectFit: "cover" }}
              />
              <IconButton
                aria-label={`Remove ${wishlist.listing.title} from wishlist`}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  removeMutation.mutate(wishlist.listing.id);
                }}
                disabled={removeMutation.isPending}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255,255,255,0.9)",
                  ":hover": { backgroundColor: "#fff" },
                }}
              >
                <DeleteOutlineOutlined fontSize="small" />
              </IconButton>
              <Box sx={{ mt: 1, px: 0.5 }}>
                <Typography sx={{ fontWeight: 600 }} noWrap>
                  {wishlist.listing.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {wishlist.listing.city}, {wishlist.listing.country}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
