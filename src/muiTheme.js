import { createTheme } from "@mui/material/styles";
import { getContext } from "./context";

const theme = getContext().getTheme();

const muiTheme = createTheme({

  palette: {

    primary: { main: theme.primaryColor },
    secondary: { main: theme.secondaryColor },
    switchColor: { main: theme.secondaryColor },
    background: { default: theme.backgroundColor }
  }
});

export function getMUITheme() {
  return muiTheme;
}
