import React from "react";

import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import InputBase from '@mui/material/InputBase';

import { Container } from "./Container";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function Logo() {

  const _Link = styled(Link)({ display: "block" });

  const Image = styled('img')({

    display: "block",
    width: '70px',
    marginRight: "15px",

    "@media (min-width: 600px)": {
      width: "100px"
    }

  });

  return (
    <_Link href="./">
      <Image src="assets/ipcv0-small.svg" />
    </_Link>
  );
}

function IOLogo() {

  const _Link = styled(Link)({

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
    <_Link href="/">
      <Image src="assets/ipcv0-io.svg" />
    </_Link>
  );
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

  return (<>
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
  </>);
}
