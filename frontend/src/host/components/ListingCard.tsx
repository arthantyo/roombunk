import { HotelOutlined } from "@mui/icons-material";
import {
  Card,
  CardActionArea,
  Box,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { HostListing } from "../types";

export function ListingCard({ listing }: { listing: HostListing }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/host/listings/${listing.id}`}
      >
        <Box
          sx={{
            aspectRatio: "4 / 3",
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Chip
            size="small"
            icon={
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor:
                    listing.status === "LIVE" ? "success.main" : "warning.main",
                }}
              />
            }
            label={listing.status === "LIVE" ? "Live" : "Draft"}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "background.paper",
              zIndex: 1,

              "& .MuiChip-icon": {
                ml: 1,
                mr: 0.05, // space between dot and text
              },
            }}
          />
          {listing.imageUrl ? (
            <Box
              component="img"
              src={listing.imageUrl}
              alt={listing.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <HotelOutlined
              sx={{
                fontSize: 50,
                color: "text.secondary",
              }}
            />
          )}
        </Box>

        <Stack spacing={1} sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {listing.title}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {listing.location}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
