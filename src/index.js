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

import MUICircularProgress from "@mui/material/CircularProgress";
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Header } from "./Header";
import { Backdrop } from "./Backdrop";
import { Card } from "./Card";
import { ConnectDialog } from "./ConnectDialog";
import { AccountDialog } from "./AccountDialog";
import { WrapCaption, WrapRow, WrapControls } from "./WrapRow";
import { SelectMenu } from "./SelectMenu";

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
    wrap_dialog,
    setWrapDialog
  ] = payload

  const ipc_database = context.ipc_database;

  return () => {

    context.addSubscriber("sortWrapPanel", "wrapPanel", (payload) => {

      const [ wrap_dialog ] = payload;
      setWrapDialog(wrap_dialog.clone());
    });

    if (ipc_database.ownersTokens == null) {

      wrap_dialog.visible = true;
      context.processSubscription(
        "updateWrapPanel",
	[ wrap_dialog ]
      );
    }

    context.addSubscriber("updateWrapPanel", "wrapPanel", (payload) => {

      const [ wrap_dialog ] = payload;
	     
      context.showCircular(true);

      ipc_database.requestOwnersTokens(
        "0xd8E09Afd099f14F245c7c3F348bd25cbf9762d3D",
        (wrap_dialog.page + 1) * wrap_dialog.rowsPerPage,
        wrap_dialog.wrapped,
        true
      ).then(() => {

	context.showCircular(false);
        setWrapDialog(wrap_dialog.clone());
      });

    });

    if (ipc_database.ownersBalance == -1) {

      wrap_dialog.visible = true;
      context.processSubscription(
        "updateWrapPanel",
	[ wrap_dialog ]
      );
    }

    return () => {

      context.removeSubscriber("sortWrapPanel", "wrapPanel");
      context.removeSubscriber("updateWrapPanel", "wrapPanel");
    }
  }
}

function changePage(wrap_dialog, nextPage) {

  return () => {

    wrap_dialog.page+= nextPage;

    context.processSubscription(
      "updateWrapPanel",
      [ wrap_dialog ]
    );
  }
}

class t_wrap_dialog {

  visible;
  wrapped;
  sortBy;
  orderBy;
  rowsPerPage;
  page;

  constructor() {

    this.visible = false;
    this.wrapped = false;
    this.sortBy = "tokenId";
    this.orderBy = "asc";
    this.rowsPerPage = 10;
    this.page = 0;
  }

  clone() {
    
    const wrap_dialog = new t_wrap_dialog;

    wrap_dialog.visible = this.visible;
    wrap_dialog.wrapped = this.wrapped;
    wrap_dialog.sortBy = this.sortBy;
    wrap_dialog.orderBy = this.orderBy;
    wrap_dialog.rowsPerPage = this.rowsPerPage;
    wrap_dialog.page = this.page;

    return wrap_dialog;
  }
}

function WrapBlank(props) {

  const WrapBlank = styled(Box)({
  
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 0",
    borderStyle: "solid",
    borderColor: `${ theme.borderTopColor } transparent ${ theme.borderBottomColor } transparent`,
    borderWidth: "1px 0 1px 0",
  });

  return (
    <WrapBlank>
      You do not own any { props.wrapped ? "wrapped" : "unwrapped" } IPCs.
    </WrapBlank>
  );
}

function WrapDialog(props) {

  const ipc_database = context.ipc_database;

  const [ wrap_dialog, setWrapDialog ] = React.useState(new t_wrap_dialog);

  const visible = wrap_dialog.visible;
  const wrapped = wrap_dialog.wrapped;
  const sortBy = wrap_dialog.sortBy;
  const orderBy = wrap_dialog.orderBy;
  const rowsPerPage = wrap_dialog.rowsPerPage;

  const totalPages = ((totalPages) => { 
    return totalPages ? totalPages : 1;
  })(Math.ceil(ipc_database.ownersBalance/rowsPerPage));

  const page = ((page) => {

    if (page < 0)
      return page = 0;
    else if (page >= totalPages)
      return totalPages - 1;
    else
      return page;

  })(wrap_dialog.page);

  wrap_dialog.page = page;

  React.useEffect(WrapEffect([
    wrap_dialog,
    setWrapDialog
  ]));

  const prevPage = page + 1 == 1 ? "none" : "inline-block";
  const nextPage = page + 1 >= totalPages ? "none" : "inline-block";

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

  // add NO IPCs view!
 // hide pages
 // add delay to button for proper animation.

  const updateRowsPerPage = (event) => {

    wrap_dialog.rowsPerPage = event.target.value;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_dialog ]);
  };

  const updateWrapped = (event) => {

    wrap_dialog.wrapped = event.target.value == "wrapped" ? true : false;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_dialog ]);
  };

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

  return (

    <CardContainer show={ visible }>

    <Card
      icon={ wrapped ? <LockIcon /> : <LockOpenIcon /> }
      title={ title }
      subtitle={ subtitle }
    >
      <Table>
        <WrapCaption controller={ wrap_dialog } />
	{
	  ownersTokens ?
	  ownersTokens.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) :
	    <WrapBlank wrapped={ wrapped } />
	}

        <Pagination>

	  <SelectMenu
	    id="wrappedSelect"
	    label="Show"
	    selected={ wrapped ? "wrapped" : "unwrapped" }
	    items={[
              { label: "Unwrapped", value: "unwrapped" },
              { label: "Wrapped", value: "wrapped" }
	    ]}
	    onChange={ updateWrapped }
	    width="140px" />

	  <SelectMenu
	    id="rowsSelect"
	    label="Rows per page"
	    selected={ rowsPerPage }
	    items={[
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "25", value: 25 },
              { label: "50", value: 50 }
	    ]}
	    onChange={ updateRowsPerPage }
	    width="140px" />

          <PageControl>
	    Page { page + 1 } of { totalPages }
	    <IconButton color="secondary" sx={{ display: prevPage }} onClick={ changePage(wrap_dialog, -1) }><ArrowLeftIcon /></IconButton>
	    <IconButton color="secondary" sx={{ display: nextPage }} onClick={ changePage(wrap_dialog, 1) }><ArrowRightIcon /></IconButton>
	  </PageControl>
	</Pagination>
      </Table>
    </Card>
    </CardContainer>
  );
}

function CircularEffect(context, show) {

  return () => {

    context.createSubscription("showCircular");
    context.createSubscription("hideCircular");

    context.addSubscriber("showCircular", "circular", () => { show(true); });
    context.addSubscriber("hideCircular", "circular", () => { show(false); });

    return () => {

      context.removeSubscriber("showCircular", "circular");
      context.removeSubscriber("hideCircular", "circular");
    };
  }
}



function CircularProgress(props) {

  const [ visible, show ] = React.useState(false);

  const display = visible ? "inline-block" : "none";

  React.useEffect(CircularEffect(context, show));

  const CircularProgress = styled(MUICircularProgress)({
    display: display
  });

  return (
    <CircularProgress
      variant="indeterminate"
      size={60}
      thickness={6}
      color="secondary"
    />
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
        <CircularProgress />
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
