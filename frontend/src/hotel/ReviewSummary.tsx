import { Avatar, Box, Button, LinearProgress, Typography } from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CleanHandsOutlinedIcon from "@mui/icons-material/CleanHandsOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Star } from "@mui/icons-material";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
const ratingDistribution = [
  [5, 72],
  [4, 18],
  [3, 6],
  [2, 3],
  [1, 1],
] as const;

const reviewCategories = [
  { label: "Cleanliness", score: "4.6", Icon: CleanHandsOutlinedIcon },
  { label: "Accuracy", score: "4.8", Icon: CheckCircleOutlineOutlinedIcon },
  { label: "Check-in", score: "4.8", Icon: OutlinedFlagIcon },
  { label: "Communication", score: "4.9", Icon: ChatBubbleOutlineOutlinedIcon },
  { label: "Location", score: "4.8", Icon: LocationOnOutlinedIcon },
  { label: "Value", score: "4.8", Icon: LocalOfferOutlinedIcon },
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

const reviewMentions = [
  ["Hospitality", 66],
  ["Biking", 7],
  ["Outdoor spaces", 25],
  ["Indoor spaces", 24],
  ["Location", 48],
  ["Pets", 14],
  ["Decor", 11],
];

export default function ReviewSummary() {
  return (
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(130px, 1fr))",
            sm: "170px repeat(6, minmax(115px, 1fr))",
          },
          overflowX: { xs: "auto", sm: "visible" },
          pb: 1,
        }}
      >
        <Box
          sx={{ display: { xs: "none", sm: "block" }, pr: 3, minWidth: 150 }}
        >
          <Typography sx={{ fontSize: "0.85rem", mb: 1.25 }}>
            Overall rating
          </Typography>
          <Box sx={{ display: "grid" }}>
            {ratingDistribution.map(([stars, percentage]) => (
              <Box
                key={stars}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography
                  sx={{ color: "#666666", fontSize: "0.7rem", width: 8 }}
                >
                  {stars}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    flex: 1,
                    height: 4,
                    borderRadius: 5,
                    backgroundColor: "#dedede",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#222222" },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {reviewCategories.map(({ label, score, Icon }) => (
          <Box
            key={label}
            sx={{
              display: { xs: "none", sm: "flex" },
              minWidth: 115,
              px: 2.5,
              borderLeft: "1px solid #dddddd",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: "1.6rem", fontWeight: 500, mt: 0.5 }}>
                {score}
              </Typography>
            </Box>
            <Box>
              <Icon sx={{ color: "#444444", fontSize: 28, mt: 1.5 }} />
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: { xs: 0, md: 3 } }}>
        <Typography sx={{ fontSize: "1.05rem", fontWeight: 500, mb: 2 }}>
          Guest reviews mention
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 1,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {reviewMentions.map(([label, count]) => (
            <Box
              key={label}
              sx={{
                flex: "0 0 auto",
                px: 2,
                py: 1.25,
                border: "1px solid #eeeeee",
                borderRadius: 1,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                fontSize: "0.8rem",
              }}
            >
              <Typography component="span" sx={{ fontWeight: 500, mr: 0.5 }}>
                {label}
              </Typography>{" "}
              <Typography component="span" sx={{ color: "#666666" }}>
                {count}
              </Typography>
            </Box>
          ))}
        </Box>
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
          <Box
            key={review.name}
            sx={{
              minWidth: 0,
              display: { xs: index < 3 ? "block" : "none", md: "block" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Avatar src={review.avatar} sx={{ width: 42, height: 42 }}>
                {review.name[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  {review.name}
                </Typography>
                <Typography sx={{ color: "#666666", fontSize: "0.78rem" }}>
                  {review.stay}
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: "0.78rem", mt: 1.25 }}>
              ★★★★★ · {review.date}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.45, mt: 0.5 }}>
              {review.text}
            </Typography>
            {review.expandable && (
              <Typography
                component="button"
                sx={{
                  border: 0,
                  background: "none",
                  p: 0,
                  mt: 0.75,
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                Show more
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Button
        variant="contained"
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
  );
}
