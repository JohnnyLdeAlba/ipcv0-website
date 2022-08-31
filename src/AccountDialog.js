import React from "react";
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LinkIcon from '@mui/icons-material/Link';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { Card } from "./Card";
import { List, ListItem } from "./Toolbox";
import { getContext } from "./context";
import { getMUITheme } from "./muiTheme";

const context = getContext();
const theme = context.getTheme();

function MetaMaskIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px",
    height: "32px"
  });

  return (<Image src="assets/metamask.webp" />);
}

function WalletConnectIcon() {

  const Image = styled('img')({
    marginRight: "24px",
    width: "32px",
    height: "32px"
  });

  return (<Image src="assets/walletconnect.webp" />);
}

function CardContainer(props) {

  const display = typeof props.show == "undefined" ||
    props.show == false ? "none" : "block";

  const _CardContainer = styled(Box)({

    display: display,
    width: "100%",

    "@media (min-width: 600px)": {
      width: "550px"
    }
  });

  return (<_CardContainer>{ props.children }</_CardContainer>);
}

function ListText(props) {

  const ListText = styled(Box)({

    display: "flex",
    flexDirection: "column",
    overflow: "hidden"
  });

  const Caption = styled(Box)({
    fontSize: "16px",
    fontWeight: "normal"
  });

  const Subcaption = styled(Box)({

    fontSize: "14px",
    fontWeight: "normal",
    color: theme.textHighlightColor,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden"
  });

  return (
    <ListText>
      <Caption>{ props.caption }</Caption>
      <Subcaption>{ props.subcaption }</Subcaption>
    </ListText>
  );
}

function ProviderItem(props) {

  switch (props.walletProvider) {

    case "MetaMask": {

      return (
        <ListItem>
          <MetaMaskIcon />
          <ListText caption="Wallet Provider" subcaption="MetaMask" />
        </ListItem>
      );
    }

    case "WalletConnect": {

      return (
        <ListItem>
	  <WalletConnectIcon />
	  <ListText caption="Wallet Provider" subcaption="Wallet Connect" />
    	</ListItem>
      );
    }
  }

  return (<></>);
}

function effectFactory(context, show, setAccountDetails) {

  return () => {

    context.createSubscription("openAccountDialog");
    context.createSubscription("closeAccountDialog");

    context.addSubscriber("openAccountDialog", "accountDialog", () => { show(true); });
    context.addSubscriber("closeAccountDialog", "accountDialog", () => { show(false); });

    context.addSubscriber("connect", "accountDialog", () => {
      setAccountDetails(context.getWalletProvider().getAccountDetails());
    });

    context.addSubscriber("disconnect", "accountDialog", () => {
      setAccountDetails(context.getWalletProvider().getAccountDetails());
    });

    context.addSubscriber("sessionUpdate", "accountDialog", () => {
      setAccountDetails(context.getWalletProvider().getAccountDetails());
    });

    return () => {

      context.removeSubscriber("openAccountDialog", "accountDialog");
      context.removeSubscriber("closeAccountDialog", "accountDialog");

      context.removeSubscriber("connect", "accountDialog");
      context.removeSubscriber("disconnect", "accountDialog");
      context.removeSubscriber("sessionUpdate", "accountDialog");
    };
  }
}

export function AccountDialog() {

  const [ visible, show ] = React.useState(false);
  const [ accountDetails, setAccountDetails ] = React.useState(
    context.getWalletProvider().getAccountDetails());

  React.useEffect(effectFactory(context, show, setAccountDetails));

  const ChainIcon = styled(LinkIcon)({

    marginRight: "24px",
    width: "32px",
    height: "32px"
  });

  const WalletIcon = styled(AccountBalanceWalletIcon)({
  
    marginRight: "24px",
    width: "32px",
    height: "32px"
  });

  const buttonStyle = {
    margin: "8px 24px"
  };

  const disconnectWC = () => {
  
    context.getWalletProvider().disconnect();
    context.hideBackdrop();
  };

  return (
    <CardContainer show={ visible }>
      <Card
        icon={ <AssignmentIndIcon /> }
        title="Account"
	subtitle="This is the wallet that's currently connected"
      >
        <List>

	  <ProviderItem walletProvider={ accountDetails.providerName } />

          <ListItem> 
	    <ChainIcon />
	    <ListText caption="Chain" subcaption={ accountDetails.chainName } />
    	  </ListItem>

	  <ListItem>
	    <WalletIcon />
	    <ListText caption="Wallet Address" subcaption={ accountDetails.account } />
    	  </ListItem>
          
          <Button variant="contained" onClick={ disconnectWC } sx={ buttonStyle }>Disconnect</Button>
        </List>
      </Card>
    </CardContainer>
  );
}
