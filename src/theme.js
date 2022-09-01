import { createTheme } from "@mui/material/styles";

const theme = {

  text: "#ffffff",
  textHighlight: "#8597aa",
  highlight: "#9fb1c5",

  rowHighligt: "#22272e",
  background: "#010409",

  header: "#0d1117",
  headerMenu: "#161b22",

  card: "#0d1117",
  cardTitle: "#161b22",

  borderTop: "#21262d",
  borderBottom: "#000000",

  select: "#161b22",
  selectHighlight: "#666b74",
  selected: "#010409", 

  snackbar: "#161b22",
  circularProgress: "#8597aa",

  primary: "#21262d",
  secondary: "#9fb1c5",

  backdropTransition: 500,
  backdropzIndex: 9999,
}

const muiTheme = createTheme({

  palette: {

    primary: { main: theme.primary },
    secondary: { main: theme.secondary },
    circularProgress: { main: theme.circularProgress },
    background: { default: theme.background }
  }
});

export function getTheme() {
  return theme;
}

export function getMUITheme() {
  return muiTheme;
}
