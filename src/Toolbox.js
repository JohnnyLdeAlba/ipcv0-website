import React from "react";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

export function List(props) {

  const List = styled(Box)({

    display: "flex",
    flexDirection: "column",
  });

  return (<List>{ props.children }</List>);
}

const style = {

  listItem: {

    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    padding: "16px",
    borderRadius: "0px",
    fontSize: "16px",
    color: theme.textColor,
    textAlign: "left",
    textTransform: "none"
  }
}

export function ListItem(props) {

  const ListItem = Box;

  return (
    <ListItem
      onClick={ props.onClick }
      sx={ style.listItem }>
        { props.children }
    </ListItem>
  );
}

export function ListButton(props) {

  const ListButton = Button;

  return (
    <ListButton
      onClick={ props.onClick }
      sx={ style.listItem }>
        { props.children }
    </ListButton>
  );
}
