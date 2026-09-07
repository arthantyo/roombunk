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
import { ReviewsModalContent } from "./ReviewSummary/ReviewsModalContent";
import { ReviewCard } from "./ReviewSummary/ReviewCard";
import { ReviewMentions } from "./ReviewSummary/ReviewMentions";
import { ReviewStats } from "./ReviewSummary/ReviewStats";
const ratingDistribution: [number, number][] = [
  [5, 72],
  [4, 18],
  [3, 6],
  [2, 3],
  [1, 1],
];

const reviewCategories = [
  { label: "Cleanliness", score: 4.6, Icon: CleanHandsOutlinedIcon },
  { label: "Accuracy", score: 4.8, Icon: CheckCircleOutlineOutlinedIcon },
  { label: "Check-in", score: 4.8, Icon: OutlinedFlagIcon },
  { label: "Communication", score: 4.9, Icon: ChatBubbleOutlineOutlinedIcon },
  { label: "Location", score: 4.8, Icon: LocationOnOutlinedIcon },
  { label: "Value", score: 4.8, Icon: LocalOfferOutlinedIcon },
];

const guestReviews = [
  {
    name: "Bennet",
    stay: "6 years on Roombunk",
    date: "July 2026",
    text: "We had a really good time here. Johanna was very nice and the house was exactly as we expected",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    name: "Marrit",
    stay: "10 years on Roombunk",
    date: "3 weeks ago",
    text: "A cozily furnished wooden cottage on a quiet green property where chickens with chicks and peacocks roam around. Surrounded by beautiful tall trees that provide pleasant ...",
    avatar: "https://i.pravatar.cc/96?img=32",
    expandable: true,
  },
  {
    name: "Bianca",
    stay: "5 months on Roombunk",
    date: "August 2026",
    text: "Had a great week's vacation with our dog! Communication with Johanna and her husband was fast and good. Nicely laid-out property with its own piece of garden and a very ...",
    avatar: "https://i.pravatar.cc/96?img=47",
    expandable: true,
  },
  {
    name: "Elvira",
    stay: "1 month on Roombunk",
    date: "July 2026",
    text: "Perfectly fine. Nice, quiet place, beautiful cottage with everything you need and a nice hostess.",
    avatar: "https://i.pravatar.cc/96?img=44",
  },
  {
    name: "Ferdie",
    stay: "1 year on Roombunk",
    date: "July 2026",
    text: "We had a nice time. It was just confusing that there are two bedrooms in the description, but in reality there is only one, which should be ...",
    avatar: "https://i.pravatar.cc/96?img=68",
    expandable: true,
  },
  {
    name: "Nidal",
    stay: "10 years on Roombunk",
    date: "July 2026",
    text: "Very lovely place to chill and enjoy the nature.",
    avatar: "https://i.pravatar.cc/96?img=53",
  },
];

const reviewMentions: [string, number][] = [
  ["Hospitality", 66],
  ["Biking", 7],
  ["Outdoor spaces", 25],
  ["Indoor spaces", 24],
  ["Location", 48],
  ["Pets", 14],
  ["Decor", 11],
];

export default function ReviewSummary() {
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
            4.78 · 151 reviews
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
