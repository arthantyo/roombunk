import { useRef, useEffect } from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { hostingSteps } from "../../constants";

type Props = {
  title: string;
  activeStep: number;
  onStepChange: (step: number) => void;
};

export function ListingEditorHeader({
  title,
  activeStep,
  onStepChange,
}: Props) {
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    chipRefs.current[activeStep]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeStep]);

  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title || "Edit listing"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": {
            height: 4,
          },
        }}
      >
        {hostingSteps.map((step, index) => {
          const selected = activeStep === index;

          return (
            <Chip
              ref={(element) => {
                chipRefs.current[index] = element;
              }}
              key={step}
              label={`${index + 1}. ${step}`}
              size="small"
              clickable
              onClick={() => onStepChange(index)}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              sx={{
                flexShrink: 0,
                fontWeight: selected ? 600 : 400,
                fontSize: "0.78rem",
              }}
            />
          );
        })}
      </Box>
    </Stack>
  );
}
