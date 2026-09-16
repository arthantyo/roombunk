import { BookmarkBorder } from "@mui/icons-material";
import { Box, Card, CardMedia, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import WishlistModal from "../listing/WishlistModal";
import { useAuth } from "../auth/useAuth";
import type { ListingDto } from "../api/types";

export function ListingCard({ listing }: { listing: ListingDto }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      <Card
        component={RouterLink}
        to={`/listings/${listing.id}`}
        sx={{
          minWidth: 0,
          width: "100%",
          background: "transparent",
          boxShadow: "none",
          border: "none",
          textDecoration: "none",
          flexShrink: 0,
          color: "inherit",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            image={
              // eslint-disable-next-line react-hooks/purity
              Math.random() > 0.66
                ? "/images/studio-stock.png"
                : // eslint-disable-next-line react-hooks/purity
                  Math.random() > 0.5
                  ? "/images/hotel-stock.png"
                  : "/images/apartment-stock.png"
            }
            alt={listing.title}
            sx={{
              width: "100%",
              aspectRatio: "1",
              borderRadius: 4,
              objectFit: "cover",
            }}
          />
          <IconButton
            aria-label={`Save ${listing.title} to a wishlist`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              if (!isAuthenticated) {
                openAuthModal();
                return;
              }
              setWishlistOpen(true);
            }}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.85)",
              width: 34,
              height: 34,
              borderRadius: "50%",
              ":hover": { background: "rgba(255,255,255,0.95)" },
            }}
          >
            <BookmarkBorder fontSize="small" sx={{ color: "#1d1d1d" }} />
          </IconButton>
        </Box>
        <Box sx={{ mt: 1.2, px: 0.5 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {listing.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mt: 0.2 }}
          >
            {listing.city}, {listing.country}
          </Typography>
          {/* <Typography variant="body2" sx={{ mt: 0.2, fontWeight: 500 }}>
          {formattedPrice}
        </Typography> */}
        </Box>
      </Card>
      <WishlistModal
        listingId={listing.id}
        listingName={listing.title}
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />
    </>
  );
}
