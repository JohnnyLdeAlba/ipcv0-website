import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";

import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

export function Card(props) {

  const display = props.show == false ? "none" : "block";

  const Card = styled(Box)({

    display: display,
    margin: "16px",
    paddingBottom: "8px",
    borderRadius: "8px",
    backgroundColor: theme.card,
    overflow: "hidden"
  });

  const CardTitle = styled(Box)({

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "10px 16px",
    borderRadius: "8px 8px 0px 0px",
    backgroundColor: theme.cardTitle,
  });

  const TitleColumn = styled(Box)({

    display: "flex",
    flexDirection: "column"
  });

  const TitleIcon = styled(Box)({
    marginRight: "16px",
    color: theme.text
  });

  const Title = styled(Box)({

    color: theme.text,
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0.2em"
  });

  const SubTitle = styled(Box)({

    fontSize: "14px",
    color: "#cccccc"
  });

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <Card onClick={ stopPropagation }>
      <CardTitle>
	<TitleIcon>{ props.icon }</TitleIcon>
        <TitleColumn>
          <Title>{ props.title }</Title>

	  { typeof props.subtitle == "undefined" ?
	      "" : <SubTitle>{ props.subtitle }</SubTitle> }

        </TitleColumn>
      </CardTitle>
      { props.children }
    </Card>
  );
}

