import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

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

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "wrapped" + ipc.token_id;

    context.addSubscriber(
      "wrapped",
      resourceId,
      (payload) => {

        const [ eventId, tokenIndex, tokenId, owner ] = payload;

        if (eventId != "wrapped" ||
          tokenId != ipc.token_id)
            return;

        ipc.wrapped = true;
        ipc.pending = false;

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

  return async () => {

    if (ipc.pending == true)
      return;

    // open dialog

    ipc.pending = true;
    setUpdate(++update);

    const resourceId = "unwrapped" + ipc.token_id;

    context.addSubscriber(
      "unwrapped",
      resourceId,
      (payload) => {

        const [ eventId, tokenIndex, tokenId, owner ] = payload;

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

export function WrapCaption(props) {

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
    fontWeight: "bold"
  });

  return (
    <WrapCaption>
      <Avatar>&nbsp;</Avatar>
      <Caption>
        <CaptionItem>Token Id</CaptionItem>
        <CaptionItem>Race</CaptionItem>
        <CaptionItem type="gender">Gender</CaptionItem>
        <CaptionItem type="height">Height</CaptionItem>
        <CaptionItem type="handedness">Handedness</CaptionItem>
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

