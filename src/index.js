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
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';


import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Header } from "./Header";
import { Backdrop } from "./Backdrop";
import { Card } from "./Card";
import { ConnectDialog } from "./ConnectDialog";
import { AccountDialog } from "./AccountDialog";
import { WrapCaption, WrapRow, WrapControls } from "./WrapRow";

import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

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
    setSortBy,
    setOrderBy,
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

  context.addSubscriber("sortWrapPanel", "wrapPanel", (payload) => {

    const [ sortBy, orderBy ] = payload;

    setSortBy(sortBy);
    setOrderBy(orderBy);
  });

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
    context.removeSubscriber("sortWrapPanel", "wrapPanel");
    context.removeSubscriber("updateWrapPanel", "wrapPanel");
  }

  }
}

function WrapDialog(props) {

  const ipc_database = context.ipc_database;

  const [ visible, show ] = React.useState(false);
  const [ wrapped, setWrapped ] = React.useState(true);
  const [ sortBy, setSortBy ] = React.useState("tokenId");
  const [ orderBy, setOrderBy ] = React.useState("asc");
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  let [ page, setPage ] = React.useState(0);

  React.useEffect(WrapEffect([
    wrapped,
    sortBy,
    orderBy,
    rowsPerPage,
    page,
    show,
    setWrapped,
    setSortBy,
    setOrderBy,
    setRowsPerPage,
    setPage
  ]));

  const totalPages = Math.ceil(ipc_database.ownersBalance/rowsPerPage);

  if (page < 0) page = 0;
  else if (page >= totalPages) page = totalPages - 1;

  const ownersTokens = ipc_database.getOwnersTokens(
    page, rowsPerPage, sortBy, orderBy);

  const title = wrapped ? "Wrapped IPCs" : "Unwrapped IPCs";
  const subtitle = wrapped ? "These are IPCs that are wrapped and safe" :
    "These are IPCs that are not wrapped and at risk";

  const Pagination = styled(Box)({

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px 0 16px"
  });

  const PageControl = styled(Box)({

    flex: 2,
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "right"
  });

 // hide pages
 // add delay to button for proper animation.

  const style = {

    inputLabel: {
	    fontSize: "14px", 
      color: theme.textColor,
      "&.Mui-focused": { color: theme.textColor }
      
    },

    select: {

      padding: "8px",
      fontSize: "12px",
      backgroundColor: theme.selectColor,
      color: theme.textColor,

      "& .MuiSelect-icon": { color: theme.textColor },
      "& .MuiInputBase-input": { fontSize: "12px",backgroundColor: theme.selectColor }
    },

    menuItem: {

      backgroundColor: theme.selectColor,
      color: theme.textColor,
    }
  };

  const InputBaseC = styled(InputBase)({

    backgroundColor: "red"
  });

  return (

    <CardContainer show={ true }>

    <Card
      icon={ wrapped ? <LockIcon /> : <LockOpenIcon /> }
      title={ title }
      subtitle={ subtitle }
    >
      <Table>
        <WrapCaption sortBy={ sortBy } orderBy={ orderBy } />
	{ ownersTokens ? ownersTokens.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) : <></> }

        <Pagination>
	  <Box>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">

	      <InputLabel id="demo-select-small" sx={style.inputLabel}>Show</InputLabel>

	      <Select
	          labelId="demo-select-small"
	          id="demo-select-small"
	          value={0}
	          label="Show"
	          MenuProps={{ sx: { "& .MuiMenu-paper": { backgroundColor: "red" }} }} 
	          sx={style.select}
	        >
	          <MenuItem value={0}>Wrapped</MenuItem>
	          <MenuItem value={1}>Unwrapped</MenuItem>
	      </Select>
	    </FormControl>
	  </Box>
	  <Box>
            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">

	      <InputLabel id="demo-select-small" sx={style.inputLabel}>Rows per page</InputLabel>

	      <Select
	          labelId="demo-select-small"
	          id="demo-select-small"
	          value={0}
	          label="Rows per page"
	          MenuProps={{ sx: { "& .MuiMenu-paper": { backgroundColor: "red" }} }} 
	          sx={style.select}
	        >
	          <MenuItem value={0}>Rows Per Page</MenuItem>
	          <MenuItem value={1}>Unwrapped</MenuItem>
	      </Select>
	    </FormControl>
	  </Box>

          <PageControl>
	    Page { page + 1 } of { totalPages }
	    <IconButton color="secondary" onClick={ () => { setPage(page - 1); } }><ArrowLeftIcon /></IconButton>
	    <IconButton color="secondary" onClick={ () => { setPage(page + 1); } }><ArrowRightIcon /></IconButton>
	  </PageControl>
	</Pagination>
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
