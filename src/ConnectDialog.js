import React from "react";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { Card } from "./Card";
import { List, ListButton } from "./Toolbox";
import { getContext } from "./context";

const context = getContext();
const theme = context.getTheme();

function MetaMaskIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px"
  });

  return (<Image src="assets/metamask.webp" />);
}

function WalletConnectIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px"
  });

  return (<Image src="assets/walletconnect.webp" />);
}

function MetaMaskDemoIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px"
  });

  return (<Image src="assets/metamask-demo.webp" />);
}

function CardContainer(props) {

  const display = typeof props.show == "undefined" ||
    props.show == false ? "none" : "block";

  const CardContainer = styled(Box)({

    display: display,
    width: "100%",

    "@media (min-width: 500px)": {
      width: "450px"
    }
  });

  return (<CardContainer>{ props.children }</CardContainer>);
}

function ListText(props) {

  const ListText = styled(Box)({
    fontWeight: "bold"
  });

  return (<ListText>{ props.children }</ListText>);
}

function ListDesc(props) {

  const ListDesc = styled(Box)({
    fontWeight: "normal",
    fontSize: "9pt"
  });

  return (<ListDesc>{ props.children }</ListDesc>);
}

function MetaMaskLI() {

  const walletProvider = context.getWalletProvider(); 

  if (walletProvider.isMobile()) {

    if (!walletProvider.mm_connector.isProvider())
      return (<></>);
  }

  const connect = () => {

    walletProvider.connect("METAMASK");
    context.processSubscription("closeConnectDialog");
    context.processSubscription("hideBackdrop");
  }

  return (
    <ListButton onClick={ connect }>
      <MetaMaskIcon /> <ListText>MetaMask</ListText> 
    </ListButton>
  );
}

function DemoConnectLI() {

  const walletProvider = context.getWalletProvider(); 

  if (walletProvider.isMobile()) {

    if (!walletProvider.demo_connector.isProvider())
      return (<></>);
  }

  const connect = () => {

    walletProvider.connect("DemoConnect");
    context.processSubscription("closeConnectDialog");
    context.processSubscription("hideBackdrop");
  }

  return (
    <ListButton onClick={ connect }>
      <MetaMaskDemoIcon /> 
      <ListText>
        Demo Mode
        <ListDesc>Requires MetaMask</ListDesc>
      </ListText>
    </ListButton>
  );
}

function effectFactory(context, show, visible) {

  return () => {

    context.createSubscription("openConnectDialog");
    context.createSubscription("closeConnectDialog");

    context.addSubscriber("openConnectDialog", "connectDialog", () => { show(true); });
    context.addSubscriber("closeConnectDialog", "connectDialog", () => { show(false); });

    return () => {

      context.removeSubscriber("openConnectDialog", "connectDialog");
      context.removeSubscriber("closeConnectDialog", "connectDialog");
    };
  }
}

export function ConnectDialog() {

  const [ visible, show ] = React.useState(false);
  React.useEffect(effectFactory(context, show, visible));

  const hide = () => { show(false); };
  const connectWC = () => {
  
    context.getWalletProvider().connect();
    context.hideBackdrop();
  };

  return (
    <CardContainer show={ visible }>
      <Card
        icon={ <AccountBalanceWalletIcon /> }
        title="Connect Wallet"
	subtitle="Choose your wallet provider"
      >
        <List>
	  <MetaMaskLI />
          <ListButton onClick={ connectWC }>
	    <WalletConnectIcon /> <ListText>Wallet Connect</ListText>
    	  </ListButton>
	  <DemoConnectLI />
        </List>
      </Card>
    </CardContainer>
  );
}

function effectFactoryDM(context, show, visible) {

  return () => {

    context.createSubscription("openDemoModeDialog");
    context.createSubscription("closeDemoModeDialog");

    context.addSubscriber("openDemoModeDialog", "demoModeDialog", () => { show(true); });
    context.addSubscriber("closeDemoModeDialog", "demoModeDialog", () => { show(false); });

    return () => {

      context.removeSubscriber("openDemoModeDialog", "demoModeDialog");
      context.removeSubscriber("closeModeModeDialog", "demoModeDialog");
    };
  }
}

export function DemoModeDialog() {

  const [ visible, show ] = React.useState(false);
  React.useEffect(effectFactoryDM(context, show, visible));

  const hide = () => { show(false); };

  const ListText = styled(Box)({
    margin: "16px",
    textAlign: "center",
    fontWeight: "normal",
    color: "#ffffff"
  });

  return (
    <CardContainer show={ visible }>
      <Card
        icon={ <AccountBalanceWalletIcon /> }
        title="Demo Mode"
      >
       <ListText>This feature does not work in Demo Mode!</ListText>
      </Card>
    </CardContainer>
  );
}
