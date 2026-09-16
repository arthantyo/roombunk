import {
  Box,
  Button,
  Dialog,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CleanHandsOutlinedIcon from "@mui/icons-material/CleanHandsOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Star } from "@mui/icons-material";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getReviewsByListingId } from "../api/reviews";
import type { ReviewDto } from "../api/types";
import { ReviewsModalContent } from "./ReviewSummary/ReviewsModalContent";
import { ReviewCard } from "./ReviewSummary/ReviewCard";
import { ReviewMentions } from "./ReviewSummary/ReviewMentions";
import { ReviewStats } from "./ReviewSummary/ReviewStats";
const categoryDefinitions = [
  {
    label: "Cleanliness",
    field: "cleanliness" as const,
    Icon: CleanHandsOutlinedIcon,
  },
  {
    label: "Accuracy",
    field: "accuracy" as const,
    Icon: CheckCircleOutlineOutlinedIcon,
  },
  { label: "Check-in", field: "checkIn" as const, Icon: OutlinedFlagIcon },
  {
    label: "Communication",
    field: "communication" as const,
    Icon: ChatBubbleOutlineOutlinedIcon,
  },
  {
    label: "Location",
    field: "location" as const,
    Icon: LocationOnOutlinedIcon,
  },
  {
    label: "Value",
    field: "valueForMoney" as const,
    Icon: LocalOfferOutlinedIcon,
  },
];

function average(reviews: ReviewDto[], field: keyof ReviewDto) {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((total, review) => total + Number(review[field] ?? 0), 0) /
    reviews.length
  );
}

export default function ReviewSummary({ listingId }: { listingId: number }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", listingId],
    queryFn: () => getReviewsByListingId(listingId),
  });

  if (reviews.length === 0) {
    return null;
  }

  const rating = average(reviews, "overallRating");
  const ratingDistribution: [number, number][] = [5, 4, 3, 2, 1].map(
    (stars) => [
      stars,
      reviews.length === 0
        ? 0
        : Math.round(
            (reviews.filter((review) => review.overallRating === stars).length /
              reviews.length) *
              100,
          ),
    ],
  );
  const reviewCategories = categoryDefinitions.map(
    ({ label, field, Icon }) => ({
      label,
      score: average(reviews, field),
      Icon,
    }),
  );
  const guestReviews = reviews.map((review) => ({
    name: review.user?.username || "Guest",
    stay: "Verified guest review",
    date: "",
    text: review.content,
    avatar: undefined,
  }));
  const reviewMentions: [string, number][] = [];

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          color: "#222222",
          flexDirection: "column",
          gap: 3,
          mt: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginBottom: { xs: 0, md: 1.5 },
          }}
        >
          <Star sx={{ color: "#222222", fontSize: 22 }} />
          <Typography sx={{ fontSize: "1.35rem", fontWeight: 500 }}>
            {rating.toFixed(2)} · {reviews.length} reviews
          </Typography>
        </Box>

        <ReviewStats
          ratingDistribution={ratingDistribution}
          reviewCategories={reviewCategories}
        />

        <Box sx={{ mt: { xs: 0, md: 3 } }}>
          <ReviewMentions reviewMentions={reviewMentions} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            columnGap: { md: 8 },
            rowGap: 4,
            mt: 1,
          }}
        >
          {guestReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={() => setReviewsOpen(true)}
          sx={{
            py: 1.2,
            alignSelf: "flex-start",
            textTransform: "none",
            color: "#222222",
            backgroundColor: "#f1f1f1",
            boxShadow: "none",
            "&:hover": { backgroundColor: "#e6e6e6", boxShadow: "none" },
          }}
        >
          Show all reviews
        </Button>
      </Box>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          slotProps={{
            paper: {
              sx: {
                height: "92dvh",
                borderRadius: "20px 20px 0 0",
                overflow: "hidden",
              },
            },
          }}
        >
          <ReviewsModalContent
            guestReviews={guestReviews}
            rating={rating}
            reviewCount={reviews.length}
            ratingDistribution={ratingDistribution}
            reviewCategories={reviewCategories}
            reviewMentions={reviewMentions}
            onClose={() => setReviewsOpen(false)}
          />
        </Drawer>
      ) : (
        <Dialog
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          maxWidth="lg"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                height: "85vh",
                maxHeight: 850,
                width: "50vw",
              },
            },
          }}
        >
          <ReviewsModalContent
            guestReviews={guestReviews}
            rating={rating}
            reviewCount={reviews.length}
            ratingDistribution={ratingDistribution}
            reviewCategories={reviewCategories}
            reviewMentions={reviewMentions}
            onClose={() => setReviewsOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
}
