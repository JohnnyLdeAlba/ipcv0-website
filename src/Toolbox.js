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
    flexDirection: "column"
  });

  return (<List>{ props.children }</List>);
}

export function ListItem(props) {

  const ListItem = styled(Button)({

    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    padding: "16px",
    borderRadius: "0px",
    fontSize: "16px",
    color: theme.textColor,
    textTransform: "none"
  });

  return (<ListItem onClick={ props.onClick }>{ props.children }</ListItem>);
}
