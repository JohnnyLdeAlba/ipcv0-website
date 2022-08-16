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

  const Row = styled(Box)({

    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: `${ theme.borderTopColor } transparent ${ theme.borderBottomColor } transparent`,
    borderWidth: "1px 0 1px 0",
  });

  return (
    <Row className={ props.className }>
      { props.children }
    </Row>
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

function approveEvent(ipc, update, setUpdate) {

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "approval" + ipc.token_id;

    context.addSubscriber(
      "pendingTransactions",
      resourceId,
      (payload) => {

        const [ eventId, owner, approved, tokenId ] = payload;

        if (eventId != "approval" &&
          tokenId != ipc.token_id)
            return;

        if (approved)
          ipc.approved = true;

        ipc.pending = false;
	setUpdate(++update);

	context.removeSubscriber(
          "pendingTransactions",
          resourceId
        );
      } 
    );
  };
}

function wrappedEvent(ipc, update, setUpdate) {

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "wrapped" + ipc.token_id;

    context.addSubscriber(
      "pendingTransactions",
      resourceId,
      (payload) => {

        const [ eventId, tokenIndex, tokenId, owner ] = payload;

        if (eventId != "wrapped" &&
          tokenId != ipc.token_id)
            return;

        ipc.wrapped = true;
        ipc.approved = false;
        ipc.pending = false;

	setUpdate(++update);

	context.removeSubscriber(
          "pendingTransactions",
          resourceId
        );
      } 
    );
  };
}

function WrapRow(props) {

  const ipc = props.ipc;
  const [ update, setUpdate ] = React.useState(0);

  const Image = styled("img")({

    width: "80px",
    height: "80px",
    imageRendering: "pixelated"
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

        <PendingButton>View</PendingButton>

        <PendingButton
	  show={ !ipc.wrapped && !ipc.approved }
	  pending={ ipc.pending }
	  onClick={ approveEvent(ipc, update, setUpdate) }>
	    Approve
	</PendingButton>

        <PendingButton
	  show={ !ipc.wrapped && ipc.approved }
	  pending={ ipc.pending }
	  onClick={ wrappedEvent(ipc, update, setUpdate) }>
	    Wrap
	</PendingButton>

        <PendingButton
	  show={ ipc.wrapped }
	  pending={ ipc.pending }
	  onClick={ unwrappedEvent(ipc, update, setUpdate) }>
	    Uwrap
	</PendingButton>

      </Action>
    </Row>
  );
}

function unwrappedEvent(ipc, update, setUpdate) {

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "unwrapped" + ipc.token_id;

    context.addSubscriber(
      "pendingTransactions",
      resourceId,
      (payload) => {

        const [ eventId, tokenIndex, tokenId, owner ] = payload;

        if (eventId != "wrapped" &&
          tokenId != ipc.token_id)
            return;

        ipc.wrapped = false;
        ipc.pending = false;

	setUpdate(++update);

	context.removeSubscriber(
          "pendingTransactions",
          resourceId
        );
      } 
    );
  };
}

function PendingButton(props) {

  const display = (typeof props.show == "undefined" ||
    props.show == true) ? "inline-flex" : "none"; 

  const label = props.pending ? "Pending" : props.children;

  const PendingButton = styled(Button)({

    display: display,
    margin: "8px 16px 8px 0",
    fontSize: "12px"
  });

  return (
    <PendingButton
      variant="contained"
      className={ props.className }
      onClick={ props.onClick }>
        { label }
    </PendingButton>
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
    context.ipc_contract.setApprovalForAll(944);
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
