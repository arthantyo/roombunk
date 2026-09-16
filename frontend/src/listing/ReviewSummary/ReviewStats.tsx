import { Box, Typography, LinearProgress, IconButton } from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import React, { useEffect, useRef, useState } from "react";

export function ReviewStats({
  ratingDistribution,
  reviewCategories,
}: {
  ratingDistribution: [number, number][];
  reviewCategories: {
    label: string;
    score: number;
    Icon: React.ElementType;
  }[];
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
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* Left arrow */}
      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,

            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      )}

      {/* Scroll container */}
      <Box
        ref={scrollRef}
        onScroll={updateArrows}
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          pb: 1,

          "&::-webkit-scrollbar": {
            display: "none",
          },

          scrollbarWidth: "none",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "170px repeat(6, 140px)",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          {/* Overall rating */}
          <Box
            sx={{
              pr: 3,
              minWidth: 170,
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", mb: 1.25 }}>
              Overall rating
            </Typography>

            <Box sx={{ display: "grid" }}>
              {ratingDistribution.map(([stars, percentage]) => (
                <Box
                  key={stars}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#666666",
                      fontSize: "0.7rem",
                      width: 8,
                    }}
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

                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#222222",
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Categories */}
          {reviewCategories.map(({ label, score, Icon }) => (
            <Box
              key={label}
              sx={{
                width: 140,
                px: 2.5,
                borderLeft: "1px solid #dddddd",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    mt: 0.5,
                  }}
                >
                  {score}
                </Typography>
              </Box>

              <Icon
                sx={{
                  color: "#444444",
                  fontSize: 28,
                  mt: 1.5,
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right arrow */}
      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "background.paper",
            boxShadow: 2,

            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
