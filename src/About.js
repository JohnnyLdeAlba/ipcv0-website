import React from "react";
import { useLocation } from "react-router-dom";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

import { Card } from "./Card";
import { getContext } from "./context";

const context = getContext();
const lang = context.getLang();

function Logo() {

  const Logo = styled('img')({

    display: "block",
    margin: "20px auto 30px auto",
    width: "45%"
  });

  return <Logo src="/assets/ipcv0.svg" />;
}

function CardContainer(props) {

  const display = props.show == false ? "none" : "block";

  const CardContainer = styled(Box)({

    display: display,
    margin: "24px auto",
    width: "100%",

    "@media (min-width: 900px)": {
      width: "875px"
    }
  });

  return (<CardContainer>{ props.children }</CardContainer>);
}

export function About(props) {

  const location = useLocation();
  const [ update, setUpdate ] = React.useState(0);

  const mounted = ((pathname) => {

    if (pathname == "/about")
      return true;

    return false;
  })(location.pathname);

  React.useEffect(() => {

    context.about.setUpdate = setUpdate;

    return () => {
      context.about.setUpdate = setUpdate;
    };
  });

  const Body = styled(Box)({
    padding: "8px 24px"    
  });

  const H1 = styled('div')({

    marginBottom: "8px",
    fontSize: "20px",
    fontWeight: "bold",
    textDecoration: "underline"
  });

  const B = styled('span')({ fontWeight: "bold" });
  const I = styled('span')({ fontStyle: "italic" });

  return (
    <CardContainer>
      <Card
        icon={ <LiveHelpIcon /> }
        title="About"
        subtitle=""
        show={ mounted }
      >
        <Body>

<Logo />

<p>This is an unofficial website for Immortal Playable Characters minted on the unsupported version 0 contract that was deployed in 2018.</p>

<p>The wrapper this website uses provides a layer of security and meta data that the original v0 (version 0) contract did not offer.</p>

<p>It is unknown exactly what went wrong with v0 which means as a collector you must accept those risks and do your own research before buying into this collection.</p>

<p>The best way to learn more is to join our discord in the links above.</p>

<H1>What are IPC's</H1>
<p><I>"Highly functional NFTs designed to provide lifelong game characters as your partners in adventure and imagination."</I></p>

<H1>What's special about v0s?</H1>
<p>The v0 contract was deployed on <B><Link href="https://etherscan.io/tx/0x62b674f6385cd319b5c7d536635e9930df26b1e5a747b8b8e02442fa5cda02ea">March 14th 2018</Link></B>, making it a historical piece of NFT history.</p>

<H1>What's the official stance on v0?</H1>
<p><I>"It is Broken, DON’T USE! IMPORTANT: This smart contract is broken, DO NOT USE IT! We do not support it, and we will NOT build games for these pre-IPC IPCs. Just want to be clear on that."</I></p>
<p>You can find out more from this <B><Link href="https://www.immortalplayercharacters.com/single-post/contract-zero-v0">official blog post</Link></B>.</p>

<H1>Is the wrapper contract verified?</H1>
<p>Yes it is, and you can view it's status along with it's source code <B><Link href="https://etherscan.io/address/0x61e1ea57558b81c3b62578901502fe74d5a924c1#code">here</Link></B>.</p>

<H1>Who can I contact if I have any questions or issues reguarding version 0 or the wrapper?</H1>
<p>I am Johnny L. de Alba, I go by <B><Link href="https://twitter.com/0xarkonviox">0xArkonviox</Link></B> on Twitter and <B><Link href="https://discord.com/invite/nft-relics">Arkonviox#6121</Link></B> on Discord. You can also email me at johnnyldealba@gmail.com. If you are interested in other proijects I have done you can view my portfolio <B><Link href="https://nexusultima.com">here</Link></B>.</p>

<H1>Additional Links</H1>
<p><B>- <Link href="https://www.immortalplayercharacters.com">Official Website</Link></B></p>
<p><B>- <Link href="https://myipc.io">MyIPC.io</Link></B></p>
<p><B>- <Link href="https://opensea.io/collection/immortalplayercharacter-v0">Unwrapped Version 0 Collection</Link></B></p>
<p><B>- <Link href="https://opensea.io/collection/immortalplayercharacter">Version 1 Collection</Link></B></p>

        </Body> 
      </Card>
    </CardContainer>
  );
}
