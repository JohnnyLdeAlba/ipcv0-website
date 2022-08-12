import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import InputBase from '@mui/material/InputBase';

import { createSubscriptions } from "./lib/subscriptions";
import "./style.css";

const theme = {

  textColor: "#ffffff",
  backgruondColor: "#010409",
  headerColor: "#0d1117",
  menuColor: "#161b22"
}

function Logo() {

  const Image = styled('img')({

    width: '70px',
    marginRight: "15px",

    "@media (min-width: 600px)": {
      width: "100px"
    }

  });

  return (<Image src="assets/ipcv0-small.svg" />);
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

function OpenSeaIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px"
  });

  return (
    <Link href="https://opensea.io/collection/immortalplayercharacters-v0-wrapped">
      <Image src="assets/opensea.svg" />
    </Link>
  );
}

function DiscordIcon() {

  const Image = styled('img')({
    width: "32px"
  });

  return (
    <Link href="https://discord.com/invite/tppsuZp7v3">
      <Image src="assets/discord.svg" />
    </Link>
  );
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

function Header(props) {

  const _Header = styled(Box)({
    backgroundColor: theme.headerColor
  });

  const InnerContainer = styled(Box)({

    display: "flex",
    flexDirection: "row",
    flexGrow: 2,
    alignItems: "center",
    alignContent: "stretch",
    padding: "24px 32px",
  });

  const LogoSpan = styled(Box)({

    display: "flex",
    flexDirection: "row",
  });

  const SocialSpan = styled(Box)({

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  });

  const SearchStack = styled(Box)({

    flex: 2,
    display: "flex",
    flexDirection: "column",
  });

  const MenuSpan = styled(Box)({
    backgroundColor: theme.menuColor
  });

  const Menu = styled(Box)({

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "12px",
    fontSize: "16px"
  });

  const MenuItem = styled(Box)({

    cursor: "pointer",
    padding: "0 16px",
    textAlign: "center",
  });

  return (
    <_Header>
      <Container>
        <InnerContainer>
	  <LogoSpan>
            <Logo />
            <IOLogo />
	  </LogoSpan>
	  <SearchStack>
	    <SocialSpan>
              <OpenSeaIcon />
              <DiscordIcon />
	    </SocialSpan>
	  </SearchStack>
	</InnerContainer>
      </Container>
      <MenuSpan>
        <Container>
	  <Menu>
	    <MenuItem>About</MenuItem>
	    <MenuItem>Wrap/Unwrap IPC</MenuItem>
	    <MenuItem>Connect Wallet</MenuItem>
          </Menu>
	</Container>
      </MenuSpan>
    </_Header>
  );
}

function Layout(props) {

  const _Layout = styled(Box)({

    height: "100vh", 
    backgroundColor: theme.backgruondColor,
    fontFamily: 'poppins-light',
    color: theme.textColor
  });

  return (
    <_Layout>
      <Header />
      { props.children }
    </_Layout>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Layout /> } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
