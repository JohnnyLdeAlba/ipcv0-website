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

  return (<Caption>{ props.children }</Caption>);
}

function Avatar(props) {

  const Avatar = styled(Box)({

    width: "80px",
    color: theme.textColor
  });

  return (
    <Avatar>{ props.children  }
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
    <Action>{ props.children }
    </Action>
  );
}

function RowSpan(props) {

  const RowSpan = styled(Box)({

    flex: 2,
    display: "flex",
    flexDirection: "column",

    "@media (min-width: 300px)": {

      display: "flex",
      flexDirection: "row",
    }
  });

  return (
    <RowSpan className={ props.className }>
      { props.children }
    </RowSpan>
  );
}

function RowItem(props) {

  const RowItem = styled(Box)({

    width: "100%",
    fontSize: "14px",
    textAlign: "left",

    "@media (min-width: 430px)": {
      width: "50%",
      textAlign: "center"
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
      { props.children }
    </RowItem>
  );

}

function Handedness(props) {

  const Handedness = styled(RowItem)({

    "@media (min-width: 300px)": {
      display: "none"
    },

    "@media (min-width: 800px)": {
      display: "block"
    }

  });

  return (
    <Handedness className={ props.className }>
      { props.children }
    </Handedness>
  );
}

function Height(props) {

  const Height = styled(RowItem)({

    "@media (min-width: 300px)": {
      display: "none"
    },

    "@media (min-width: 700px)": {
      display: "block"
    }

  });

  return (<Height>{ props.children }</Height>);
}

function Gender(props) {

  const Gender = styled(RowItem)({

    "@media (min-width: 300px)": {
      display: "none"
    },

    "@media (min-width: 600px)": {
      display: "block"
    }

  });

  return (<Gender>{ props.children }</Gender>);
}


function Race(props) {

  const Race = styled(RowItem)({

    "@media (min-width: 300px)": {
      display: "none"
    },

    "@media (min-width: 430px)": {
      display: "block"
    }

  });

  return (<Race>{ props.children }</Race>);
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
      <Avatar><Image src="gif/1.gif" /></Avatar>
      <RowSpan>
        <RowItem>#{ ipc.token_id }</RowItem>
        <Race>{ ipc.subrace }</Race>
        <Gender>{ ipc.gender }</Gender>
        <Height>{ ipc.height }</Height>
        <Handedness>{ ipc.handedness }</Handedness>
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

  const ipc = database[0];

  const Caption = styled(RowSpan)({
    padding: "16px 0"
  });

  const CaptionItem = styled(RowItem)({
    fontWeight: "bold"
  });

  return (

    <CardContainer show={ true }>

    <Card
      icon={ <LockIcon />  }
      title="Wrap"
      subtitle="Wrap individual tokens"
    >
      <Table>

        <Row>
          <Avatar>&nbsp;</Avatar>
	  <Caption>
	    <CaptionItem>Token Id</CaptionItem>
	    <CaptionItem type="race">Race</CaptionItem>
	    <CaptionItem type="gender">Gender</CaptionItem>
	    <CaptionItem type="height">Height</CaptionItem>
	    <CaptionItem type="handedness">Handedness</CaptionItem>
	  </Caption>
          <Action>&nbsp;</Action>
	</Row>

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
    backgroundColor: theme.backgruondColor,
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
