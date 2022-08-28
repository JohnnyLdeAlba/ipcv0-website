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
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function CardContainer(props) {

  const display = typeof props.show === "undefined" ||
    props.show === false ? "none" : "block";

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

function wrapEffect(wrap_panel, setWrapPanel) {

  const ipc_database = context.ipc_database;

  return () => {

    context.wrap_panel = wrap_panel;
    context.wrap_panel.setWrapPanel = setWrapPanel;

    context.addSubscriber("connect", "wrapPanel", (payload) => {

      context.processSubscription(
        "updateWrapPanel"
      );
    });

    context.addSubscriber("sessionUpdate", "wrapPanel", (payload) => {

      context.processSubscription(
        "updateWrapPanel"
      );
    });

    context.addSubscriber("disconnect", "wrapPanel", (payload) => {

      wrap_panel.visible = false;
      wrap_panel.update();
    });

    context.addSubscriber("updateWrapPanel", "wrapPanel", (payload) => {

      const accountDetails = context.getAccountDetails();

      if (wrap_panel.mounted === false)
        return;

      if (accountDetails.account == null)
        return;

      context.showCircular(true);
      ipc_database.requestOwnersTokens(
	accountDetails.account,
        (wrap_panel.page + 1) * wrap_panel.rowsPerPage,
        wrap_panel.wrapped,
        true
      ).then(() => {

	context.showCircular(false);

        wrap_panel.visible = true;
        wrap_panel.update();

        setWrapPanel(wrap_panel.clone());
      });

    });

    if (ipc_database.ownersBalance === -1) {

      context.processSubscription(
        "updateWrapPanel",
	[ wrap_panel ]
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

function changePage(wrap_panel, nextPage) {

  return () => {

    wrap_panel.page+= nextPage;

    context.processSubscription(
      "updateWrapPanel",
      [ wrap_panel ]
    );
  }
}

class t_wrap_panel {

  serial;
  mounted;
  visible;
  wrapped;
  sortBy;
  orderBy;
  rowsPerPage;
  page;
  setWrapPanel;

  constructor() {

    this.serial = 0;
    this.mounted = false;
    this.visible = false;
    this.wrapped = false;
    this.sortBy = "tokenId";
    this.orderBy = "asc";
    this.rowsPerPage = 10;
    this.page = 0;
    this.setWrapPanel = (wrap_panel) => {};
  }

  clone() {
    
    const wrap_panel = new t_wrap_panel();

    wrap_panel.serial = this.serial;
    wrap_panel.mounted = this.mounted;
    wrap_panel.visible = this.visible;
    wrap_panel.wrapped = this.wrapped;
    wrap_panel.sortBy = this.sortBy;
    wrap_panel.orderBy = this.orderBy;
    wrap_panel.rowsPerPage = this.rowsPerPage;
    wrap_panel.page = this.page;

    return wrap_panel;
  }

  update() {

    this.serial++;
    this.setWrapPanel(this.clone());
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

export function WrapPanel(props) {

  const location = useLocation();

  const ipc_database = context.ipc_database;
  const [ wrap_panel, setWrapPanel ] = React.useState(new t_wrap_panel);

  context.wrap_panel = wrap_panel;
  context.wrap_panel.setWrapPanel = setWrapPanel;

  //needs to be fixed to make wrap panel independant from other components
  if (location.pathname === "/wrap-unwrap")
    wrap_panel.mounted = true;

  const visible = wrap_panel.visible;
  const wrapped = wrap_panel.wrapped;
  const sortBy = wrap_panel.sortBy;
  const orderBy = wrap_panel.orderBy;
  const rowsPerPage = wrap_panel.rowsPerPage;

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

  })(wrap_panel.page);

  wrap_panel.page = page;

  React.useEffect(wrapEffect(
    wrap_panel,
    setWrapPanel
  ));

  const prevPage = page + 1 == 1 ? "none" : "inline-block";
  const nextPage = page + 1 >= totalPages ? "none" : "inline-block";

  const ownersTokens = ipc_database.getOwnersTokens(
    page, rowsPerPage, sortBy, orderBy);

  const title = wrapped ? "Wrapped IPCs" : "Unwrapped IPCs";
  const subtitle = wrapped ? "These are IPCs that are wrapped and safe" :
    "These are IPCs that are not wrapped and at risk";

  const Pagination = styled(Box)({

    display: "block",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px 0 16px",

    "@media (min-width: 530px)": {
      display: "flex"
    }
  });

  const PageSelect = styled(Box)({
    display: "flex",
    flexDirection: "row"
  });

  const PageControl = styled(Box)({

    flex: 2,
    fontSize: "14px",
    fontWeight: "bold",
    textAlign: "right"
  });

  const updateRowsPerPage = (event) => {

    wrap_panel.rowsPerPage = event.target.value;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_panel ]);
  };

  const updateWrapped = (event) => {

    wrap_panel.wrapped = event.target.value == "wrapped" ? true : false;

    ipc_database.processSubscription(
      "updateWrapPanel", [ wrap_panel ]);
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

  // remove wrap config from this....
  return (
    <CardContainer show={ visible }>

    <WrapConfig />

    <Card
      icon={ wrapped ? <LockIcon /> : <LockOpenIcon /> }
      title={ title }
      subtitle={ subtitle }
    >
      <Table>
        <WrapCaption controller={ wrap_panel } />
	{
	  ownersTokens ?
	  ownersTokens.map(ipc => <WrapRow key={ ipc.token_id } ipc={ ipc } />) :
	    <WrapBlank wrapped={ wrapped } />
	}

        <Pagination>

	  <PageSelect>
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
          </PageSelect>

          <PageControl>
	    Page { page + 1 } of { totalPages }
	    <IconButton color="secondary" sx={{ display: prevPage }} onClick={ changePage(wrap_panel, -1) }><ArrowLeftIcon /></IconButton>
	    <IconButton color="secondary" sx={{ display: nextPage }} onClick={ changePage(wrap_panel, 1) }><ArrowRightIcon /></IconButton>
	  </PageControl>
	</Pagination>
      </Table>
    </Card>
    </CardContainer>
  );
}
