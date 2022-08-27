import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";

import { SnackbarProvider } from "notistack";
import { Header } from "./Header";
import { Backdrop } from "./Backdrop";
import { ConnectDialog } from "./ConnectDialog";
import { AccountDialog } from "./AccountDialog";
import { CircularProgress } from "./CircularProgress";

import { getContext } from "./context";
import { getMUITheme } from "./muiTheme";
import { SnackbarSubscriber } from "./Snackbar";
import { Explorer } from "./Explorer";
import { WrapPanel } from "./WrapPanel";

import "./style.css";

const context = getContext();
const theme = context.getTheme();
const muiTheme = getMUITheme();

function Layout(props) {

  const Layout = styled(Box)({

    height: "100vh",
    overflow: "auto",
    backgroundColor: theme.backgroundColor,
    fontFamily: 'poppins-light',
    color: theme.textColor
  });

  return (<>
    <CssBaseline />
    <ThemeProvider theme={ muiTheme }>
    <SnackbarProvider maxSnack={ 4 }>
      <Backdrop>
        <ConnectDialog /> 
        <AccountDialog />
        <CircularProgress />
      </Backdrop>
      <SnackbarSubscriber />
      <Layout>
        <Header />
	<Explorer />
	<WrapPanel />
        { props.children }
      </Layout>
    </SnackbarProvider>
    </ThemeProvider>
  </>);
}

async function main() {

  await context.initialize();

  const root = document.getElementById('root');

  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Layout /> } />
          <Route path=":value" element={ <Layout /> } />
          <Route path="/wrap-unwrap" element={ <Layout /> } />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
    root
  );
}

main();
