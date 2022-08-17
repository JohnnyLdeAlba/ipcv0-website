import contractABI from "./lib/ipc-wrapper-abi.json";

import WalletConnectProvider from "@walletconnect/web3-provider";

import { ethers } from "ethers";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import InputBase from '@mui/material/InputBase';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';

import { Header } from "./Header";
import { Backdrop } from "./Backdrop";
import { Card } from "./Card";
import { ConnectDialog } from "./ConnectDialog";
import { AccountDialog } from "./AccountDialog";
import { WrapCaption, WrapRow } from "./WrapRow";

import { getContext } from "./context";
import { getMUITheme } from "./muiTheme";

import "./style.css";

const context = getContext();
const theme = context.getTheme();
const muiTheme = getMUITheme();

function CardBody(props) {

  const _CardBody = styled(Box)({

    padding: "16px"
  });

  return (
    <_CardBody>
      { props.children }
    </_CardBody>
  );
}

function CardContainer(props) {

  const display = typeof props.show == "undefined" ||
    props.show == false ? "none" : "block";

  const CardContainer = styled(Box)({

    display: display,
    margin: "24px auto",
    width: "100%",

    "@media (min-width: 900px)": {
      width: "875px"
    }
  });

  return (<CardContainer>{ props.children }</CardContainer>);
}

function Table(props) {

  const Table = styled(Box)({

    display: "flex",
    flexDirection: "column",
    color: theme.textColor
  });

  return (<Table>{ props.children }</Table>);
}


function WrapEffect(payload) {

  const [
    wrapped,
    sortBy,
    orderBy,
    rowsPerPage,
    page,
    show,
    setWrapped,
    setRowsPerPage,
    setPage
  ] = payload

  const ipc_database = context.ipc_database;

  return async () => {

  if (ipc_database.ownersTokens == null) {

    await ipc_database.requestOwnersTokens(
      "0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D",  // context.mwc_provider.getAccountDetails().account,
      page * rowsPerPage,
      wrapped,
      true
    );
    
    show(true);
    setWrapped(wrapped);
    setRowsPerPage(rowsPerPage);
    setPage(page);
  }

  context.addSubscriber("updateWrapPanel", "wrapPanel", async (payload) => {

    const [
      visible,
      wrapped,
      rowsPerPage,
      page
    ] = payload;

    if (visible != null) show(visible);
    if (wrapped != null) setWrapped(wrapped);

    setRowsPerPage(rowsPerPage);
    setPage(page);

    await ipc_database.requestOwnersTokens(
      "0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D",
      page * rowsPerPage,
      wrapped,
      true
    );

  });

  return () => {
    context.aremoveSubscriber("updateWrapPanel", "wrapPanel");
  }

  }
}

function WrapDialog(props) {

  const ipc_database = context.ipc_database;

  const [ visible, show ] = React.useState(false);
  const [ wrapped, setWrapped ] = React.useState(true);
  const [ sortBy, setSortBy ] = React.useState("tokenId");
  const [ orderBy, setOrderBy ] = React.useState("asc");
  const [ rowsPerPage, setRowsPerPage ] = React.useState(4);
  const [ page, setPage ] = React.useState(0);

  React.useEffect(WrapEffect([
    wrapped,
    sortBy,
    orderBy,
    rowsPerPage,
    page,
    show,
    setWrapped,
    setRowsPerPage,
    setPage
  ]));

  const ownersTokens = ipc_database.getOwnersTokens(
    page, rowsPerPage);

  return (

    <CardContainer show={ true }>

    <Card
      icon={ <LockIcon />  }
      title="Wrap/Unwrap IPCs"
      subtitle="Wrap individual tokens"
    >
      <Table>

	
        <WrapCaption />
	<Button onClick={ () => { setPage(page - 1);  }  }>Prev</Button>
	<Button onClick={ () => { setPage(page + 1);  }  }>Next</Button>
	{ ownersTokens ? ownersTokens.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) : <></> }

        <Box sx={{ padding: "12px 16px 8px 16px" }}>
          <Box sx={{ fontSize: "14px", textAlign: "right" }}>1 of 1 &nbsp; &lt; &nbsp; &gt;</Box>
	</Box>
      </Table>
    </Card>
    </CardContainer>
  );
}

function Layout(props) {

  const _Layout = styled(Box)({

    height: "100vh",
    overflow: "auto",
    backgroundColor: theme.backgroundColor,
    fontFamily: 'poppins-light',
    color: theme.textColor
  });

  return (<>
    <CssBaseline />
    <ThemeProvider theme={ muiTheme }>
      <Backdrop>
        <ConnectDialog /> 
        <AccountDialog />

      </Backdrop>
      <_Layout>
        <Header />
	<WrapDialog />
        { props.children }
      </_Layout>
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
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
    root
  );
}

main();
