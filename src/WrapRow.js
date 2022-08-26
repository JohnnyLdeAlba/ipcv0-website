import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import MenuList from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Switch from "@mui/material/Switch";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

class t_lang {

  key;
  value;

  constructor() {

    key = "";
    value = "";
  }

  set(key, value) {

    this.key = key;
    this.value = value;
  }
}

const eng_caption = [];

eng_caption.push(new t_lang("APPROVAL_FOR_ALL_NOT_OWNER", "Unable to set approval for all. The connected wallet does not have authorization."));
eng_caption.push(new t_lang("APPROVAL_NOT_OWNER", "Unable to approve token. The connected wallet does not own token."));
eng_caption.push(new t_lang("TOKEN_LIMIT_REACHED", "Unable to wrap token. The token limit has been reached."));
eng_caption.push(new t_lang("TOKEN_ALREADY_WRAPPED", "The selected token has already been wrapped."));
eng_caption.push(new t_lang("WRAPPED_NOT_OWNER", "Unable to wrap token. The connected wallet does not own token."));
eng_caption.push(new t_lang("UNWRAPPED_NOT_OWNER", "Unable to unwrap token. The connected wallet does not own token."));
eng_caption.push(new t_lang("TOKEN_NOT_WRAPPED", "Unable to unwrap token. The selected token is not wrapped."));
eng_caption.push(new t_lang("TOKEN_STOLEN", "The selected token may have been stolen."));
eng_caption.push(new t_lang("NAMECHANGE_DISABLED", "Unable to change IPC's name. Marketplace has been disabled."));
eng_caption.push(new t_lang("NAMECHANGE_NOT_OWNER", "Unable to change IPC's name. The connected wallet does not own token."));


function lang_eng(id) {

  const label = [

    "TOKEN_NOT_WRAPPED", 
  ];

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

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "approval" + ipc.token_id;

    context.addSubscriber(
      "approval",
      resourceId,
      (payload) => {

        const [ eventId, owner, approved, tokenId ] = payload;

        if (eventId != "approval" ||
          tokenId != ipc.token_id)
            return;

        if (approved)
          ipc.approved = true;

        ipc.pending = false;
	setUpdate(++update);

	context.removeSubscriber(
          "approval",
          resourceId
        );
      } 
    );
  };
}

function wrappedEvent(ipc, update, setUpdate) {

  const ipc_contract = context.ipc_contract;

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    const tx = await ipc_contract.wrap(ipc.token_id);
    if (tx.code == -1) {

      context.openSnackbar(
        "error",
        tx.payload,
        tx.payload
      );    

      return;
    }

    context.openSnackbar(
      "pending",
      tx.payload,
      tx.payload,
      "https://etherscan.io/tx/" + tx.payload
    );    

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "wrapped" + ipc.token_id;

    context.addSubscriber(
      "wrapped",
      resourceId,
      (payload) => {

        const [ eventId, tokenId, owner ] = payload;

        if (eventId != "wrapped" ||
          tokenId != ipc.token_id)
            return;

        ipc.wrapped = true;
        ipc.pending = false;

        context.openSnackbar(
          "success",
          "WRAPPED",
          "WRAPPED"
        );    

	setUpdate(++update);

	context.removeSubscriber(
          "wrapped",
          resourceId
        );
      } 
    );
  };
}

function unwrappedEvent(ipc, update, setUpdate) {

  const ipc_contract = context.ipc_contract;

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    const tx = await ipc_contract.unwrap(ipc.token_id);
    if (tx.code == -1)
      return;

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "unwrapped" + ipc.token_id;

    context.addSubscriber(
      "unwrapped",
      resourceId,
      (payload) => {

        const [ eventId, tokenId, owner ] = payload;

        console.log(eventId);
        console.log(tokenId);
        console.log(owner);

        if (eventId != "unwrapped" ||
          tokenId != ipc.token_id)
            return;

        ipc.approved = true;
        ipc.wrapped = false;
        ipc.pending = false;

	setUpdate(++update);

	context.removeSubscriber(
          "unwrapped",
          resourceId
        );
      } 
    );
  };
}

export function WrapControls(props) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickListItem = (event) => {
	    setAnchorEl(event.currentTarget);
	  };

  const ControlRow = styled(Row)({

    display: "none",
    padding: "8px 0",

  });

  const SwitchWrapper = styled(Box)({

    padding: "0 16px",
    fontSize: "14px",
    fontWeight: "bold"
  });

  const WrapSwitch = Switch;
  return (<>
	   <Button onClick={handleClickListItem} >test</Button>
      <MenuList sx={{ '& .MuiPaper-root': { backgroundColor: "red"  }  }} open={anchorEl ? true : false} anchorEl={anchorEl} >
        <MenuItem>test</MenuItem>
      </MenuList>
	  </>
  );
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
    color: theme.textColor,
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

function onClick(sortBy, controller) {

  return () => {

    controller.sortBy = sortBy;
    controller.orderBy = controller.orderBy == "asc"
      ? "desc" : "asc";

    context.processSubscription("sortWrapPanel", [ controller ]);
  }
}

export function WrapCaption(props) {

  const controller = props.controller;

  const sortBy = controller.sortBy;
  const orderBy = controller.orderBy;

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

        <CaptionItem onClick={ onClick("tokenId", controller) }>
	  Token Id
	  <SortButton
	    show={ tokenId }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem onClick={ onClick("race", controller) }>
	  Race
	  <SortButton
	    show={ race }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="gender" onClick={ onClick("gender", controller) }>
	  Gender
	  <SortButton
	    show={ gender }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="height" onClick={ onClick("height", controller) }>
	  Height
	  <SortButton
	    show={ height }
	    orderBy={ orderBy }
	  />
	</CaptionItem>

        <CaptionItem type="handedness" onClick={ onClick("handedness", controller) }>
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

export function WrapRow(props) {

  const [ update, setUpdate ] = React.useState(0);

  const ipc = props.ipc ? props.ipc : null;
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

        <PendingButton>View</PendingButton>

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
	    Uwrap
	</PendingButton>

      </Action>
    </Row>
  );
}

