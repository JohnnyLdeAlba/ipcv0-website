import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";

export function Container(props) {

  const _Container = styled(Box)({
 
    margin: "0",
    width: "auto",

    "@media (min-width: 900px)": {

      margin: "0 auto",
      width: "800px"
    },

    "@media (min-width: 1100px)": {
      width: "1000px"
    }
  });

  return (<_Container>{props.children}</_Container>);
}
