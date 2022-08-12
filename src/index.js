import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import InputBase from '@mui/material/InputBase';

import { Header } from "./Header";
import { Backdrop } from "./Backdrop";

import { getContext } from "./context";

import "./style.css";

const context = getContext();
const theme = context.getTheme();

function Layout(props) {

  const _Layout = styled(Box)({

    height: "100vh", 
    backgroundColor: theme.backgruondColor,
    fontFamily: 'poppins-light',
    color: theme.textColor
  });

  return (<>
    <Backdrop>
    ...
    </Backdrop>
    <_Layout>
      <Header />
      { props.children }
    </_Layout>
  </>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
