import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getHotels } from "../api/hotels";
import { ApiError } from "../api/client";

const PAGE_SIZE = 9;

export default function Home() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hotels", page],
    queryFn: () => getHotels(page, PAGE_SIZE),
  });

  const filteredHotels = useMemo(() => {
    const hotels = data?.content ?? [];
    if (!search.trim()) return hotels;
    const term = search.toLowerCase();
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(term) ||
        h.city.toLowerCase().includes(term),
    );
  }, [data, search]);

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Explore stays
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find your next getaway from our curated collection of hotels.
        </Typography>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search by hotel name or city"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4, maxWidth: 480 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {isError && (
        <Alert severity="error">
          {error instanceof ApiError
            ? error.message
            : "Unable to load hotels. Please try again later."}
        </Alert>
      )}

      <Grid container spacing={3}>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}

        {!isLoading &&
          filteredHotels.map((hotel) => (
            <Grid key={hotel.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card elevation={2}>
                <CardActionArea
                  component={RouterLink}
                  to={`/hotels/${hotel.id}`}
                >
                  <Box
                    sx={{
                      height: 140,
                      background:
                        "linear-gradient(135deg, #0f6f5c 0%, #1b9c81 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      color="white"
                      sx={{ px: 2, textAlign: "center", fontWeight: 700 }}
                    >
                      {hotel.name}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{ mb: 1, alignItems: "center" }}
                    >
                      <LocationOnIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {hotel.city}, {hotel.state}, {hotel.country}
                      </Typography>
                    </Stack>
                    <Chip
                      label={hotel.address}
                      size="small"
                      variant="outlined"
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
      </Grid>

      {!isLoading && filteredHotels.length === 0 && (
        <Typography sx={{ mt: 4 }} color="text.secondary">
          No hotels match your search.
        </Typography>
      )}

      {data && data.totalPages > 1 && (
        <Stack sx={{ mt: 4, alignItems: "center" }}>
          <Pagination
            count={data.totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}
