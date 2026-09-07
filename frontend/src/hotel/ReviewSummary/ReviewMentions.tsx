import { Box, Typography, IconButton } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useEffect, useRef, useState } from "react";

export function ReviewMentions({
  reviewMentions,
}: {
  reviewMentions: [string, number][];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;

    if (!el) return;

    setShowLeft(el.scrollLeft > 0);

    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();

    window.addEventListener("resize", updateArrows);

    return () => {
      window.removeEventListener("resize", updateArrows);
    };
  }, [reviewMentions]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "1.05rem",
          fontWeight: 500,
          mb: { xs: 0, sm: 0, md: 2 },
        }}
      >
        Guest reviews mention
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
        }}
      >
        {showLeft && (
          <IconButton
            onClick={() => scroll("left")}
            sx={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,

              width: 36,
              height: 36,

              bgcolor: "background.paper",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",

              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}

        <Box
          ref={scrollRef}
          onScroll={updateArrows}
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollBehavior: "smooth",
            pb: 1,

            "&::-webkit-scrollbar": {
              display: "none",
            },

            scrollbarWidth: "none",
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
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontWeight: 500,
                  mr: 0.5,
                }}
              >
                {label}
              </Typography>

              <Typography
                component="span"
                sx={{
                  color: "#666666",
                }}
              >
                {count}
              </Typography>
            </Box>
          ))}
        </Box>

        {showRight && (
          <IconButton
            onClick={() => scroll("right")}
            sx={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,

              width: 36,
              height: 36,

              bgcolor: "background.paper",
              border: "1px solid #ddd",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",

              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
