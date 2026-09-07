import {
  Accordion,
  AccordionSummary,
  Box,
  Typography,
  AccordionDetails,
} from "@mui/material";

type CheckoutStepProps = {
  number: number;
  title: string;
  subtitle: string;
  completed: boolean;
  expanded: boolean;
  onChange: () => void;
  children: React.ReactNode;
};

export function CheckoutStep({
  number,
  title,
  expanded,
  onChange,
  children,
}: CheckoutStepProps) {
  return (
    <Accordion
      expanded={expanded}
      disableGutters
      onChange={onChange}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.12)",
        borderRadius: 2,
        "&.MuiAccordion-root": {
          position: "static",
          borderRadius: 2,
        },
      }}
    >
      <AccordionSummary
        sx={{
          border: 0,
          px: 0,
          py: 1.5,
          "& .MuiAccordionSummary-content": {
            my: 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ padding: "1rem", flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 0.3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.2rem",
                }}
              >
                {number}. {title}
              </Typography>
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          px: 0,
          padding: "1rem",
          mt: 0,
          pt: 0,
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}
