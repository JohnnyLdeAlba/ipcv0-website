import React from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import InputBase from '@mui/material/InputBase';

import { Container } from "./Container";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function Logo() {

  const RLink = styled(Link)({ display: "block" });

  const Image = styled('img')({

    display: "block",
    width: '70px',
    marginRight: "15px",

    "@media (min-width: 600px)": {
      width: "100px"
    }

  });

  return (
    <RLink href="/">
      <Image src="assets/ipcv0-small.svg" />
    </RLink>
  );
}

function IOLogo() {

  const RLink = styled(Link)({

    display: "none",

    "@media (min-width: 700px)": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    }

  });

  const Image = styled('img')({

    marginRight: "15px",
    width: "160px"
  });

  return (
    <RLink href="/">
      <Image src="assets/ipcv0-io.svg" />
    </RLink>
  );
}

function OpenSeaIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px"
  });

  return (
    <Link href="https://opensea.io/collection/immortal-player-characters-v0-wrapped">
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

function MenuItem(props) {

  const MenuItem = styled(Button)({

    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",

    padding: "12px 10px",
    borderRadius: "0px",

    fontFamily: "poppins-light",
    fontSize: "12px",
    fontWeight: "normal", 
    color: theme.textColor,
    textAlign: "center",

    "@media (min-width: 600px)": {

      padding: "12px 16px",
      fontSize: "14px"
    }
  });

  return (
    <MenuItem onClick={ props.onClick }>
      { props.children }
    </MenuItem>
  );
}

function effectFactory(context, setConnection) {

  const walletProvider = context.getWalletProvider();

  return () => {

    context.addSubscriber("connect", "connectMenuItem", () => {
      setConnection(walletProvider.isConnected());
    });

    context.addSubscriber("disconnect", "connectMenuItem", () => {
      setConnection(walletProvider.isConnected());
    });

    return () => {

      context.removeSubscriber("connect", "connectDialog");
      context.removeSubscriber("disconnect", "connectDialog");
    };
  }
}

function ConnectMenuItem(props) {

  const [ connected, setConnection ] = React.useState(
    context.getWalletProvider().isConnected());

  React.useEffect(effectFactory(context, setConnection));

  const openConnectDialog = () => {

    context.processSubscription("showBackdrop");
    context.processSubscription("openConnectDialog");
  };

  if (!connected) {

    return (
      <MenuItem onClick={ openConnectDialog }>Connect Wallet</MenuItem>
    );
  }

  const openAccountDialog = () => {

    context.processSubscription("showBackdrop");
    context.processSubscription("openAccountDialog");
  };

  return (
    <MenuItem onClick={ openAccountDialog }>Account</MenuItem>
  );
}

export function Header(props) {

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

  const LogoRow = styled(Box)({

    display: "flex",
    flexDirection: "row",
  });

  const SocialSpan = styled(Box)({

    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end"
  });

  const SearchColumn = styled(Box)({

    flex: 2,
    display: "flex",
    flexDirection: "column",
  });

  const MenuRow = styled(Box)({
    backgroundColor: theme.menuColor
  });

  const Menu = styled(Box)({

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    fontSize: "16px"
  });

  return (<>
    <_Header>
      <Container>
        <InnerContainer>
	  <LogoRow>
            <Logo />
            <IOLogo />
	  </LogoRow>
	  <SearchColumn>
	    <SocialSpan>
              <OpenSeaIcon />
              <DiscordIcon />
	    </SocialSpan>
	  </SearchColumn>
	</InnerContainer>
      </Container>
      <MenuRow>
        <Container>
	  <Menu>
            <MenuItem>About</MenuItem>
            <MenuItem>
              <Link href="https://opensea.io/collection/immortal-player-characters-v0-wrapped">
                OpenSea
              </Link> 
            </MenuItem>
	    <ConnectMenuItem />
          </Menu>
	</Container>
      </MenuRow>
    </_Header>
  </>);
}
