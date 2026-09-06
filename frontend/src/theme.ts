import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f6f5c",
    },
    secondary: {
      main: "#e8815c",
    },
    background: {
      default: "#f7f7f5",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ['"Rubik"', "system-ui", "sans-serif"].join(","),
  },
});

export default theme;
