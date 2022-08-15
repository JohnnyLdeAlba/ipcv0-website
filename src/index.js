import contractABI from "./ipc-wrapper-abi.json";

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

function Row(props) {

  const Caption = styled(Box)({

    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: `${ theme.borderTopColor } transparent ${ theme.borderBottomColor } transparent`,
    borderWidth: "1px 0 1px 0",
  });

  return (
    <Caption className={ props.className }>
      { props.children }
    </Caption>
  );
}

function Avatar(props) {

  const Avatar = styled(Box)({
    width: "80px",
  });

  return (
    <Avatar>
      { props.children  }
    </Avatar>
  );
}

function Action(props) {

  const Action = styled(Box)({

    width: "33%",
    textAlign: "center",

    "@media (min-width: 450px)": {
      width: "25%"
    },

    "@media (min-width: 800px)": {
      textAlign: "right"
    }

  });

  return (
    <Action>
      { props.children }
    </Action>
  );
}

function RowSpan(props) {

  const RowSpan = styled(Box)({

    boxSizing: "border-box",
    flex: 2,
    display: "flex",
    flexDirection: "column",
    padding: "8px 0",

    "@media (min-width: 430px)": {

      display: "flex",
      flexDirection: "row",
      padding: "0",
    }
  });

  return (
    <RowSpan className={ props.className }>
      { props.children }
    </RowSpan>
  );
}

function RowItem(props) {

  switch (props.type) {

    case "gender":
      return (<Gender className={ props.className }>{ props.children }</Gender>);
    case "height":
      return (<Height className={ props.className }>{ props.children }</Height>);
    case "handedness":
      return (<Handedness className={ props.className }>{ props.children }</Handedness>);
  }

  const Label = styled(Box)({

    display: "inline",
    marginRight: "12px",
    fontWeight: "bold",

    "@media (min-width: 430px)": {

      display: "none",
      marginBottom: "0",
    }
  });

  const RowItem = styled(Box)({

    padding: "4px 8px 4px 0",
    width: "100%",
    fontSize: "14px",
    textAlign: "left",

    "@media (min-width: 430px)": {

      display: "block",
      flexDirection: "initial",

      padding: "0",
      width: "50%",
      textAlign: "center",
    },

    "@media (min-width: 600px)": {
      width: "33%",
    },

    "@media (min-width: 700px)": {
      width: "25%",
    },

    "@media (min-width: 800px)": {
      width: "20%",
    }

  });

  return (
    <RowItem className={ props.className }>
      { props.label ? <Label>{ props.label }</Label> : <></> }
      { props.children }
    </RowItem>
  );

}

function Handedness(props) {

  const Handedness = styled(RowItem)({

    display: "block",
    "@media (min-width: 430px)": {
      display: "none"
    },

    "@media (min-width: 800px)": {
      display: "block"
    }

  });

  return (
    <Handedness
      label={ props.label }
      className={ props.className }
    >
      { props.children }
    </Handedness>
  );
}

function Height(props) {

  const Height = styled(RowItem)({

    display: "block",
    "@media (min-width: 430px)": {
      display: "none"
    },

    "@media (min-width: 700px)": {
      display: "block"
    }

  });

  return (
    <Height
      label={ props.label }
      className={ props.className }
    >
      { props.children }
    </Height>
  );
}

function Gender(props) {

  const Gender = styled(RowItem)({

    display: "block",

    "@media (min-width: 430px)": {
      display: "none"
    },

    "@media (min-width: 600px)": {
      display: "block"
    }

  });

  return (
    <Gender
      label={ props.label }
      className={ props.className }
    >
      { props.children }
    </Gender>);
}

function WrapRow(props) {

  const ipc = props.ipc;

  const Image = styled("img")({

    width: "80px",
    height: "80px",
    imageRendering: "pixelated"
  });

  const SmButton = styled(Button)({

    margin: "8px 16px 8px 0",
    fontSize: "12px"
  });

  return (
    <Row>
      <Avatar><Image src={ "gif/" + ipc.token_id + ".gif" }/></Avatar>
      <RowSpan>
        <RowItem label="Name">#{ ipc.token_id }</RowItem>
        <RowItem label="Race">{ ipc.subrace }</RowItem>
        <Gender label="Gender">{ ipc.gender }</Gender>
        <Height label="Height">{ ipc.height }</Height>
        <Handedness label="Handed">{ ipc.handedness }</Handedness>
      </RowSpan>
      <Action>
        <SmButton variant="contained">View</SmButton>
        <SmButton variant="contained">Approve</SmButton>
      </Action>
    </Row>
  );
}

function WrapDialog(props) {

  const database = context.getDatabase();

  const ipc = database[943];

  const CaptionRow = styled(Row)({

    display: "none",
    padding: "8px 0",

    "@media (min-width: 430px)": {
      display: "flex"
    }
  });

  const Caption = styled(RowSpan)({
    padding: "16px 0"
  });

  const CaptionItem = styled(RowItem)({
    fontWeight: "bold"
  });

  const onClick = async () => {

    console.log("test");

    const wcprovider = new WalletConnectProvider({
	    rpc: { 1: "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk" }
    });

    wcprovider.enable();

    const provider = new ethers.providers.Web3Provider(wcprovider);

    // check if connected
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log("Account:", await signer.getAddress());

    const wrapAddress = "0xD0f54E91ee2e57EA72B0836565E8dfFDb0a5F950";

    const contract = new ethers.Contract(wrapAddress, contractABI, signer);

    let message = contract.filters.Wrapped();
    
    console.log(message);
   
    return;

    message = await contract.approve("0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D", 944)
      .catch((error) => {

        console.log(error);
    });

    console.log(message);
  };

  return (

    <CardContainer show={ true }>

    <Card
      icon={ <LockIcon />  }
      title="Wrap/Unwrap IPCs"
      subtitle="Wrap individual tokens"
    >
      <Table>

        <CaptionRow>
          <Avatar>&nbsp;</Avatar>
	  <Caption>
	    <CaptionItem>Token Id</CaptionItem>
	    <CaptionItem>Race</CaptionItem>
	    <CaptionItem type="gender">Gender</CaptionItem>
	    <CaptionItem type="height">Height</CaptionItem>
	    <CaptionItem type="handedness">Handedness</CaptionItem>
	  </Caption>
          <Action>&nbsp;</Action>
	</CaptionRow>

  	<WrapRow ipc={ ipc } />

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
