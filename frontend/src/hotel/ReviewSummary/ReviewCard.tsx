import { Box, Avatar, Typography } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReviewCard({ review, sx }: { review: any; sx?: object }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Avatar
          src={review.avatar}
          sx={{
            width: 42,
            height: 42,
          }}
        >
          {review.name[0]}
        </Avatar>

        <Box>
          <Typography
            sx={{
              fontSize: "0.85rem",
              fontWeight: 500,
            }}
          >
            {review.name}
          </Typography>

          <Typography
            sx={{
              color: "#666666",
              fontSize: "0.78rem",
            }}
          >
            {review.stay}
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          fontSize: "0.78rem",
          mt: 1.25,
        }}
      >
        ★★★★★ · {review.date}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.9rem",
          lineHeight: 1.45,
          mt: 0.5,
        }}
      >
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
  );
}
