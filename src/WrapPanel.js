import React from "react";
import { styled } from '@mui/material/styles';
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';

import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Card } from "./Card";
import { WrapCaption, WrapRow } from "./WrapRow";
import { SelectMenu } from "./SelectMenu";

import ArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import ArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { WrapConfig } from "./WrapConfig";
import { WrapPagination } from "./WrapPagination";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function wrapEffect(wrap_panel, setWrapPanel) {

  const ipc_database = context.ipc_database;

  return () => {

    context.wrap_panel = wrap_panel;
    context.wrap_panel.setWrapPanel = setWrapPanel;

    context.addSubscriber("connect", "wrapPanel", () => {

      context.processSubscription(
        "updateWrapPanel"
      );
    });

    context.addSubscriber("sessionUpdate", "wrapPanel", () => {

      context.processSubscription(
        "updateWrapPanel"
      );
    });

    context.addSubscriber("disconnect", "wrapPanel", () => {

      ipc_database.resetOwnersTokens();
      wrap_panel.show(false);
    });

    context.addSubscriber("updateWrapPanel", "wrapPanel", () => {

      const accountDetails = context.getAccountDetails();

      if (wrap_panel.mounted == false)
        return;

      if (accountDetails.account == null) {

        context.processSubscription("showBackdrop");
        context.processSubscription("openConnectDialog");

        return;
      }

      context.processSubscription("hideBackdrop");
      context.processSubscription("closeConnectDialog");

      context.showCircular(true);

      ipc_database.requestOwnersTokens(
	accountDetails.account,
        (wrap_panel.page + 1) * wrap_panel.rowsPerPage,
        wrap_panel.wrapped,
        true
      ).then(() => {

	context.showCircular(false);

        wrap_panel.show(true);
        wrap_panel.update();
      });

    });

    if (ipc_database.ownersBalance == -1) {

      context.processSubscription(
        "updateWrapPanel"
      );
    }

    return () => {

      context.wrap_panel.setWrapPanel = (wrap_panel) => {};

      context.removeSubscriber("connect", "wrapPanel");
      context.removeSubscriber("updateSession", "wrapPanel");
      context.removeSubscriber("disconnect", "wrapPanel");
      context.removeSubscriber("sortWrapPanel", "wrapPanel");
      context.removeSubscriber("updateWrapPanel", "wrapPanel");
    }
  }
}

function CardContainer(props) {

  const display = props.show == false ? "none" : "block";

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
    color: theme.text
  });

  return (<Table>{ props.children }</Table>);
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

function WrapTable(props) {

  const location = useLocation();

  const ipc_database = context.ipc_database;
  const [ wrap_panel, setWrapPanel ] = React.useState(context.wrap_panel);

  context.wrap_panel = wrap_panel;
  context.wrap_panel.setWrapPanel = setWrapPanel;

  const wrapped = wrap_panel.wrapped;
  const sortBy = wrap_panel.sortBy;
  const orderBy = wrap_panel.orderBy;
  const rowsPerPage = wrap_panel.rowsPerPage;

  const totalPages = ((totalPages) => { 
    return totalPages ? totalPages : 1;
  })(Math.ceil(ipc_database.ownersBalance/rowsPerPage));

  wrap_panel.totalPages = totalPages;

  const page = ((page) => {

    if (page < 0)
      return page = 0;
    else if (page >= totalPages)
      return totalPages - 1;
    else
      return page;

  })(wrap_panel.page);

  wrap_panel.page = page;

  React.useEffect(wrapEffect(
    wrap_panel,
    setWrapPanel
  ));

  const ownersTokens = ipc_database.getOwnersTokens(
    page, rowsPerPage, sortBy, orderBy);

  const title = wrapped ? "Wrapped IPCs" : "Unwrapped IPCs";
  const subtitle = wrapped ? "These are IPCs that are wrapped and safe" :
    "These are IPCs that are not wrapped and at risk";

  return (
    <Card
      icon={ wrapped ? <LockIcon /> : <LockOpenIcon /> }
      title={ title }
      subtitle={ subtitle } 
      show={ props.show }
    >
      <Table>
        <WrapCaption controller={ wrap_panel } />
	{
	  ownersTokens ?
	  ownersTokens.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) :
	    <WrapBlank wrapped={ wrapped } />
	}
      </Table>
      <WrapPagination />
    </Card>
  );
}

export function WrapPanel(props) {

  const wrap_panel = context.wrap_panel;

  const location = useLocation();
  const [ visible, show ] = React.useState(wrap_panel.visible);

  React.useEffect(() =>{

     wrap_panel.showWrapPanel = show;

    return () => {
       wrap_panel.showWrapPanel = (visible) => {};
    };
  });

  if (location.pathname == "/")
    wrap_panel.mounted = true;
  else
    wrap_panel.mounted = false;

  const mounted = wrap_panel.mounted;

  return (
    <CardContainer show={ mounted }>
      <WrapConfig show={ visible } />
      <WrapTable show={ visible } />
    </CardContainer>
  );

}
