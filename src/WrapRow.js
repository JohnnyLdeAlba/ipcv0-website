import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { IPCLib } from "./lib/ipc-lib";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();
const lang = context.getLang();

function Row(props) {

  const Row = styled(Box)({

    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderStyle: "solid",
    borderColor: `${ theme.borderTop } transparent ${ theme.borderBottom } transparent`,
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
      return (<Gender className={ props.className } onClick={ props.onClick }>{ props.children }</Gender>);
    case "height":
      return (<Height className={ props.className } onClick={ props.onClick }>{ props.children }</Height>);
    case "handedness":
      return (<Handedness className={ props.className } onClick={ props.onClick }>{ props.children }</Handedness>);
    default: break;
  }

  const Label = styled(Box)({

    display: "inline-block",
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
      padding: "0",
      width: "50%",
      textAlign: "center",
    },

    "@media (min-width: 600px)": {
      width: "33%",
    },

    "@media (min-width: 650px)": {
      width: "25%",
    },

    "@media (min-width: 850px)": {
      width: "20%",
    }

  });

  return (
    <RowItem className={ props.className } onClick={ props.onClick }>
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

    "@media (min-width: 850px)": {
      display: "block"
    }

  });

  return (
    <Handedness
      label={ props.label }
      className={ props.className }
      onClick={ props.onClick }
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

    "@media (min-width: 650px)": {
      display: "block"
    }

  });

  return (
    <Height
      label={ props.label }
      className={ props.className }
      onClick={ props.onClick }
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
      onClick={ props.onClick }
    >
      { props.children }
    </Gender>);
}



function approvalEvent(ipc, update, setUpdate) {

  const ipc_contract = context.ipc_contract;

  const eventId = "wrapRowUnmount_" + ipc.token_id;
  const resourceId = "approval_" + ipc.token_id;

  return async () => {

    if (ipc.pending == true)
      return;

    if (await ipc_contract.isApprovedForAll()) {

      ipc.approved = true;
      ipc.wrapped = false;
      ipc.pending = false;
      setUpdate(++update);

      return;
    }

    const tx = await ipc_contract.approve(ipc.token_id);
    if (tx.code == -1) {

      if (tx.payload == "")
        return;

      context.openSnackbar(
        "error",
        lang.getCaption("MUST_BE_APPROVED"),
        lang.getMessage("MUST_BE_APPROVED")
      );    

      return;
    }

    context.openSnackbar(
      "pending",
      lang.getCaption("APPROVAL_PENDING"),
      lang.getMessage("APPROVAL_PENDING"),
      "https://etherscan.io/tx/" + tx.payload
    );    

    ipc.pending = true;
    setUpdate(++update);

    context.addSubscriber(
      "approval",
      resourceId,
      (event_id, subscriber_id, payload) => {

        const [ owner, approved, tokenId ] = payload;

        if (event_id != "approval" ||
          tokenId != ipc.token_id)
            return;

        if (approved)
          ipc.approved = true;

        ipc.pending = false;
	setUpdate(++update);

        context.openSnackbar(
          "success",
          lang.getCaption("APPROVAL_OK"),
          lang.getMessage("APPROVAL_OK")
        );    

	context.removeSubscriber(
          "approval",
          resourceId
        );
      });

    context.addSubscriber(
      eventId,
      resourceId,
      () => {
        context.removeSubscriber(
          "approval",
          resourceId
        );
    });
  };
}

function wrappedEvent(ipc, update, setUpdate) {

  const ipc_contract = context.ipc_contract;

  const eventId = "wrapRowUnmount_" + ipc.token_id;
  const resourceId = "wrapped_" + ipc.token_id;

  return async () => {

    if (ipc.pending == true)
      return;

    if (await ipc_contract.isApprovedForAll() == false) {

      if (await ipc_contract.isApproved(ipc.token_id) == false) {

        ipc.approved = false;
        ipc.wrapped = false;
        ipc.pending = false;
	setUpdate(++update);

	context.openSnackbar(
          "error",
          lang.getCaption("TOKEN_NOT_APPROVED"),
          lang.getMessage("TOKEN_NOT_APPROVED")
        );    

        return;
      }
    }

    const tx = await ipc_contract.wrap(ipc.token_id);

    if (tx.code == -1) {

      if (tx.payload == "")
        return;

      context.openSnackbar(
        "error",
        lang.getCaption(tx.payload),
        lang.getMessage(tx.payload)
      );    

      return;
    }

    context.openSnackbar(
      "pending",
      lang.getCaption("WRAP_PENDING"),
      lang.getMessage("WRAP_PENDING"),
      "https://etherscan.io/tx/" + tx.payload
    );    

    ipc.pending = true;
    setUpdate(++update);

    context.addSubscriber(
      "wrapped",
      resourceId,
      (event_id, subscriber_id, payload) => {

        const [ tokenId, owner ] = payload;

        if (event_id != "wrapped" ||
          tokenId != ipc.token_id)
            return;

        ipc.wrapped = true;
        ipc.pending = false;
	setUpdate(++update);

        context.openSnackbar(
          "success",
          lang.getCaption("WRAP_OK"),
          lang.getMessage("WRAP_OK")
        );    

	context.removeSubscriber(
          "wrapped",
          resourceId
        );
      } 
    );

    context.addSubscriber(
      eventId,
      resourceId,
      () => {
        context.removeSubscriber(
          "wrapped",
          resourceId
        );
    }); 
  };
}

function unwrappedEvent(ipc, update, setUpdate) {

  const ipc_contract = context.ipc_contract;

  const eventId = "wrapRowUnmount_" + ipc.token_id;
  const resourceId = "unwrapped_" + ipc.token_id;

  return async () => {

    if (ipc.pending == true)
      return;

    const tx = await ipc_contract.unwrap(ipc.token_id);
    if (tx.code == -1) {

      if (tx.payload == "")
        return;

      context.openSnackbar(
        "error",
        lang.getCaption(tx.payload),
        lang.getMessage(tx.payload)
      );  

      return;
    }

    context.openSnackbar(
      "pending",
      lang.getCaption("UNWRAP_PENDING"),
      lang.getMessage("UNWRAP_PENDING"),
      "https://etherscan.io/tx/" + tx.payload
    );    

    ipc.pending = true;
    setUpdate(++update);

    context.addSubscriber(
      "unwrapped",
      resourceId,
      (event_id, subscriber_id, payload) => {

        const [ tokenId, owner ] = payload;

        if (event_id != "unwrapped" ||
          tokenId != ipc.token_id)
            return;

        ipc.approved = true;
        ipc.wrapped = false;
        ipc.pending = false;
	setUpdate(++update);

        context.openSnackbar(
          "success",
          lang.getCaption("UNWRAP_OK"),
          lang.getMessage("UNWRAP_OK")
        );    

	context.removeSubscriber(
          "unwrapped",
          resourceId
        );
      } 
    );

    context.addSubscriber(
      eventId,
      resourceId,
      () => {
        context.removeSubscriber(
          "unwrapped",
          resourceId
        );
    });
  };
}

function SortButton(props) {

  const ArrowRightDisplay = props.show == false
    ? "inline-block" : "none";

  const ArrowUpDisplay = props.orderBy == "desc" && props.show == true
    ? "inline-block" : "none";

  const ArrowDownDisplay = props.orderBy == "asc" && props.show == true
    ? "inline-block" : "none";

  const SortButton = styled(Box)({

    position: "absolute",
    display: "inline-block",
    margin: "-2px 0 0 6px",
    color: theme.text,
  });

  const ArrowRight = styled(ArrowRightIcon)({
    display: ArrowRightDisplay
  });

  const ArrowDropUp = styled(ArrowDropUpIcon)({
    display: ArrowUpDisplay
  });

  const ArrowDropDown = styled(ArrowDropDownIcon)({
    display: ArrowDownDisplay
  });

  return (
    <SortButton onClick={ props.onClick }>
      <ArrowRight />
      <ArrowDropUp />
      <ArrowDropDown />
    </SortButton>
  );
}

function onClick(sortBy) {

  return () => {

    const wrap_panel = context.wrap_panel;

    wrap_panel.sortBy = sortBy;
    wrap_panel.orderBy = wrap_panel.orderBy == "asc"
      ? "desc" : "asc";

    wrap_panel.update();
  }
}

export function WrapCaption(props) {

  const wrap_panel = context.wrap_panel;

  const sortBy = wrap_panel.sortBy;
  const orderBy = wrap_panel.orderBy;

  const tokenId = sortBy == "tokenId" ? true : false;
  const race = sortBy == "race" ? true : false;
  const gender = sortBy == "gender" ? true : false;
  const height = sortBy == "height" ? true : false;
  const handedness = sortBy == "handedness" ? true : false;

  const WrapCaption = styled(Row)({

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

    userSelect: "none",
    position: "relative",
    fontWeight: "bold"
  });

  return (
    <WrapCaption>
      <Avatar>&nbsp;</Avatar>
      <Caption>

        <CaptionItem onClick={ onClick("tokenId") }>
	  Token Id
	  <SortButton
	    show={ tokenId }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem onClick={ onClick("race") }>
	  Race
	  <SortButton
	    show={ race }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="gender" onClick={ onClick("gender") }>
	  Gender
	  <SortButton
	    show={ gender }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="height" onClick={ onClick("height") }>
	  Height
	  <SortButton
	    show={ height }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="handedness" onClick={ onClick("handedness") }>
	  Handedness
	  <SortButton
	    show={ handedness }
	    orderBy={ orderBy }
	  />
	</CaptionItem>
       </Caption>

       <Action>&nbsp;</Action>
    </WrapCaption>
 );
}

function effectWrapRow(eventId) {

  return () => {
    return () => {
      context.processSubscription(eventId);
    };
  };
}

export function WrapRow(props) {

  const [ update, setUpdate ] = React.useState(0);
  const ipc = props.ipc ? props.ipc : new IPCLib.t_label_ipc();

  const eventId = "wrapRowUnmount_" + ipc.token_id;
  React.useEffect(effectWrapRow(eventId));

  if (props.ipc == null)
    return (<></>);

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

        <PendingButton onClick={ () => { window.open(`/card/${ipc.token_id}.jpg`); } }>Card</PendingButton>

        <PendingButton
	  show={ !ipc.wrapped && !ipc.approved }
	  pending={ ipc.pending }
	  onClick={ approvalEvent(ipc, update, setUpdate) }>
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
	    Unwrap
	</PendingButton>

      </Action>
    </Row>
  );
}

