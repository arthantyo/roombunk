import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import { Button, Card, CardActionArea, Stack, Typography } from "@mui/material";

import type { PlaceAccessType } from "../types";

type Props = {
  value: PlaceAccessType;
  onChange: (value: PlaceAccessType) => void;
  onBack: () => void;
  onNext: () => void;
};

const options: {
  value: PlaceAccessType;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "entire",
    title: "An entire place",
    description: "Guests have the whole place to themselves.",
    icon: <HomeFilledIcon />,
  },
  {
    value: "private-room",
    title: "A room",
    description:
      "Guests have their own room in a home, plus access to shared spaces.",
    icon: <MeetingRoomIcon />,
  },
  {
    value: "shared-room",
    title: "A shared room in a hostel",
    description: "Guests sleep in a shared room with other guests.",
    icon: <NightShelterIcon />,
  },
];

export default function PlaceAccessStep({
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  return (
    <Stack spacing={3}>
      <Typography variant="h6" sx={{ fontWeight: 500 }}>
        What type of place will guests have?
      </Typography>

      <Stack spacing={2}>
        {options.map((option) => {
          const selected = value === option.value;

          return (
            <Card
              key={option.value}
              variant="outlined"
              sx={{
                borderColor: selected ? "primary.main" : "divider",
                borderWidth: selected ? 2 : 1,
                borderRadius: 1,
              }}
            >
              <CardActionArea
                onClick={() => onChange(option.value)}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textAlign: "left",
                }}
              >
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {option.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    ml: 3,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {option.icon}
                </Stack>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button onClick={onBack}>Back</Button>

        <Button variant="contained" onClick={onNext}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
