import React from "react";
import ReactDOM from "react-dom/client";

import {styled} from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import {createSubscriptions} from "./lib/subscriptions";
import "./style.css";

const theme = {

  textColor: "#ffffff",
  backgruondColor: "#2e2e2e",
  menubarColor: "#181818",
}

function Logo() {

  const Image = styled('img')({

    width: '80px',
    marginRight: "15px",

    "@media (min-width: 600px)": {
      width: "100px"
    }

  });

  return (<Image src="assets/ipcv0.svg" />);
}

function IOLogo() {

  const Image = styled('img')({

    display: "none",

    "@media (min-width: 700px)": {
      display: "block",
      marginRight: "15px",
      width: "160px"
    }

  });

  return (<Image src="assets/ipcv0-io.svg" />);
}

function Container(props) {

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

function Menubar(props) {

  const _Menubar = styled(Box)({
    backgroundColor: theme.menubarColor
  });

  const InnerContainer = styled(Box)({

    display: "flex",
    flexDirection: "row",
    flexGrow: 2,
    alignItems: "center",
    alignContent: "stretch",
    padding: "24px 32px",
  });

  const LogoWrapper = styled(Box)({

    display: "flex",
    flexDirection: "row",
  });

  const Menu = styled(Box)({

    flex: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: "8px",
    fontSize: "16px"
  });

  const MenuItem = styled(Box)({
    padding: "0 16px"
  });

  return (
    <_Menubar>
      <Container>
        <InnerContainer>
	  <LogoWrapper>
            <Logo />
            <IOLogo />
	  </LogoWrapper>
	  <Menu>
	    <MenuItem>About</MenuItem>
	    <MenuItem>Explore</MenuItem>
	    <MenuItem>Connect Wallet</MenuItem>
	  </Menu>
	</InnerContainer>
      </Container>
    </_Menubar>
  );
}

function Layout(props) {

  const _Layout = styled(Box)({

    height: "100vh", 
    backgroundColor: theme.backgruondColor,
    color: theme.textColor
  });

  return (
    <_Layout>
      <Menubar />
      {props.children}
    </_Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CssBaseline />
    <Layout/>
  </React.StrictMode>
);
