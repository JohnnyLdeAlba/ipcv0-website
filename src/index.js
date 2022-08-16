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

async function getUnwrappedList(owner, approved) {

  owner = "0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D";
  approved = approved ? true : false;

  const ipc_contract = context.ipc_contract;

  const balance = await ipc_contract.uwBalanceOf(owner);
  if (balance == 0)
    return null;

  // Need to make this a config var
  if (balance > 100)
    balance = 100;

  const tokenList = []

  const tokenIdList = await ipc_contract
    .uwGetOwnersTokenIdList(owner, 0, balance);

  for (let index = 0; index < tokenIdList.length; index++) {

    const token = context.database[tokenIdList[index] + 1];

    token.approved = approved;
    tokenList.push(token);
  }

  tokenList.sort((a, b) => { return a.token_id - b.token_id });
  return [ tokenList, balance ];
}

async function getWrappedList(owner, approved) {

  owner = "0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D";
  approved = approved ? true : false;

  const ipc_contract = context.ipc_contract;

  const balance = await ipc_contract.wBalanceOf(owner);
  if (balance == 0)
    return null;

  // Need to make this a config var
  if (balance > 100)
    balance = 100;

  const tokenList = []

  const tokenIdList = await ipc_contract
    .wGetOwnersTokenIdList(owner, 0, balance);

  for (let index = 0; index < tokenIdList.length; index++) {

    const token = context.database[tokenIdList[index] + 1];

    token.approved = approved;
    token.wrapped = true;
    tokenList.push(token);
  }

  tokenList.sort((a, b) => { return a.token_id - b.token_id });
  return [ tokenList, balance ];
}

let ipcList = [];

function WrapDialog(props) {

  const [ update, setUpdate ] = React.useState(0);

  React.useEffect(async () => {

    if (ipcList.length == 0) {

      [ ipcList,] = await getWrappedList(null, true);
      setUpdate(update + 1);
    }

  });

  return (

    <CardContainer show={ true }>

    <Card
      icon={ <LockIcon />  }
      title="Wrap/Unwrap IPCs"
      subtitle="Wrap individual tokens"
    >
      <Table>

        <WrapCaption />
	{ ipcList.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) }

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
