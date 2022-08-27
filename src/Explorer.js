import React from "react";
import { styled } from '@mui/material/styles';
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import PeopleIcon from '@mui/icons-material/People';

import { Card } from "./Card";
import { SelectMenu } from "./SelectMenu";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();
const lang = context.getLang();

class t_explorer {

  mounted;

  constructor() {

    this.mounted = false;
  }
}

function Container(props) {

  const display = typeof props.show == "undefined" ||
    props.show == false ? "none" : "block";

  const Container = styled(Box)({

    display: display,
    margin: "24px auto",
    width: "100%",

    "@media (min-width: 900px)": {
      width: "700px"
    }
  });

  return (<Container>{ props.children }</Container>);
}

function Image(props) {

  const Image = styled('img')({
    imageRendering: "pixelated",
    width: "160px",
    height: "160px",
    marginBottom: "16px"
  });

  const url = `/gif/${props.tokenId}.gif`;

  return <Image src={ url } />;
}

function Row(props) {

  const Row = styled(Box)({

    display: "flex",
    flexDirection: "row",
  });

  return (
    <Row>{ props.children }</Row>
  );
}

function Column(props) {

  const Column = styled(Box)({

    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  });

  return (
    <Column>{ props.children }</Column>
  );
}

function ColumnR(props) {

  const Column = styled(Box)({

    flex: "2",
    display: "flex",
    flexDirection: "column",
    padding: "18px 18px 18px 0"
  });

  return (
    <Column>{ props.children }</Column>
  );
}



function AttributeBox(props) {

  const AttributeBox = styled(Box)({

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    width: "110px",
    height: "110px",
    borderRadius: "8px",
    backgroundColor: theme.cardTitleColor,
    fontFamily: "poppins-semibold",
    fontSize: "28px",
    fontWeight: "bold"
  });

  const Label = styled(Box)({

    position: "relative",
    top: "-12px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase"
  });

  return (
    <AttributeBox>
      <Label>{ props.label }</Label>
      { props.value }
    </AttributeBox>
  );
}

function DNA(props) {

  const AttributeBox = styled(Box)({

    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
    borderRadius: "8px",
    backgroundColor: theme.cardTitleColor,
  });

  const Label = styled(Box)({

    position: "relative",
    top: "-12px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase"
  });

  return (
    <AttributeBox>
	 test
    </AttributeBox>
  );
}



export function Explorer(props) {

  const ipc_database = context.ipc_database;
  const explorer = React.useState(new t_explorer);
  const location = useLocation();

  const match = location.pathname.match(/\/([0-9]+)/);

  const tokenId = ((match) => {

    return match == null ? 0 : match[1];
  })(match);

  if (tokenId > 0)
    explorer.mounted = true;

  const ipc = ipc_database.getIpc(tokenId);
	 
  const title = `${ipc.token_id} - ${ipc.subrace}`;
  const subtitle = `${ipc.gender}`;

  return (
    <Container show={ explorer.mounted }>
    <Card
      icon= { <PeopleIcon /> }
      title={ title }
      subtitle={ subtitle }
    >
      <Row>
	<Column>
          <Image tokenId={ tokenId } />
	  <AttributeBox label="Strength" value={ ipc.strength } />
	  <AttributeBox label="Dexterity" value={ ipc.dexterity } />
	  <AttributeBox label="Intelligence" value={ ipc.intelligence } />
	  <AttributeBox label="Constitution" value={ ipc.constitution } />
	  <AttributeBox label="Luck" value={ ipc.luck } />
	</Column>
	<ColumnR>
	  <DNA />
	</ColumnR>
      </Row>
    </Card>
    </Container>
  );
}
