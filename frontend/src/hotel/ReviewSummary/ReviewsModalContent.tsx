import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReviewStats } from "./ReviewStats";
import { ReviewMentions } from "./ReviewMentions";
import { ReviewCard } from "./ReviewCard";

export function ReviewsModalContent({
  onClose,
  guestReviews,
  ratingDistribution = [],
  reviewCategories = [],
  reviewMentions = [],
}: {
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  guestReviews: any[];
  ratingDistribution?: [number, number][];
  reviewCategories?: {
    label: string;
    score: number;
    Icon: React.ElementType;
  }[];
  reviewMentions?: [string, number][];
}) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: "1px solid #eeeeee",
          flexShrink: 0,
        }}
      >
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 600 }}>
          4.78 · 151 reviews
        </Typography>

        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ReviewStats
            ratingDistribution={ratingDistribution}
            reviewCategories={reviewCategories}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <ReviewMentions reviewMentions={reviewMentions} />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(1, minmax(0, 1fr))",
            },
            gap: { xs: 4, md: 5 },
          }}
        >
          {guestReviews.map((review) => (
            <ReviewCard key={review.name} review={review} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
