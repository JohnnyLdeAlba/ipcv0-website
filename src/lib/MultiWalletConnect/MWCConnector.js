import { createMMConnector } from "./MetaMaskConnector";
import { createWCConnector } from "./WalletConnectConnector";
import { createDemoConnector } from "./DemoConnector";
import { t_subscriptions } from "../subscriptions"

class t_multi_wallet_connect extends t_subscriptions {

  defaultChainId;
  mm_connector;
  wc_connector;
  demo_connector;

  constructor() {

    super();

    this.defaultChainId = "0x1";
    this.mm_connector = null;
    this.wc_connector = null;
    this.demo_connector = null;
  }

  async initialize() {

    this.mm_connector = createMMConnector();
    this.wc_connector = createWCConnector();
    this.demo_connector = createDemoConnector();

    this.mm_connector.setDefaultChainId(this.defaultChainId);
    this.wc_connector.setDefaultChainId(this.defaultChainId);
    this.demo_connector.setDefaultChainId(this.defaultChainId);

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");

    this.mm_connector.subscriptions = this.subscriptions;
    this.wc_connector.subscriptions = this.subscriptions;
    this.demo_connector.subscriptions = this.subscriptions;

    await this.mm_connector.initialize();
    await this.wc_connector.initialize();
    await this.demo_connector.initialize();
  }

  setProviderURI(uri) {
    this.wc_connector.setProviderURI(uri);
  }

  setDefaultChainId(defaultChainId) {

    if (typeof defaultChainId == "undefined")
      defaultChainId = "0x1";

    this.defaultChainId = defaultChainId;
  }

  // Need providers to handle their own translations.
  getChainName(chainId) {

    switch (chainId) {

      // Meta Mask definitions.
      case "0x1": return "Ethereum";

      // WalletConnect definitions.
      case 1: return "Ethereum";
      case "1": return "Ethereum";
    }

    return "Unknown";
  }

  isMobile() {
    
    if (/Mobi/i.test(navigator.userAgent))
      return true;

    return false;
  }

  mobileConnect() {

    if (this.isMobile()) {

      if (this.mm_connector.mobileConnect())
        return true;
      else
        this.wc_connector.connect();
    }

    return true;
  }

  autoConnect(session) {

    switch (session.providerName) {

      case 'MetaMask': {

        this.mm_connector.autoConnect(session);
        return;
      }

      case 'WalletConnect': {

        this.wc_connector.autoConnect(session);
        return;
      }

      case 'DemoConnect': {

        this.demo_connector.autoConnect(session);
        return;
      }

    }
  }

  connect(id) {

    switch (id) {

      case 'METAMASK': {

        if (this.isMobile())
          this.mm_connector.mobileConnect();
        else
          this.mm_connector.connect();

        break;
      }

      case 'DemoConnect': {

        this.demo_connector.connect();
        return;
      }

      default: {

        this.wc_connector.connect()
        break;
      }
    }
  }

  disconnect() {

    this.mm_connector.disconnect();
    this.wc_connector.disconnect();
    this.demo_connector.disconnect();

    this.chainId = null;
    this.account = null;
  }

  isConnected() {

    if (this.mm_connector.isConnected())
      return true
    else if (this.wc_connector.isConnected())
      return true;
    else if (this.demo_connector.isConnected())
      return true;

    return false;
  }

  getWeb3Provider() {

    if (this.mm_connector.isConnected())
      return this.mm_connector.getWeb3Provider();

    else if (this.wc_connector.isConnected())
      return this.wc_connector.getWeb3Provider();
    else if (this.demo_connector.isConnected())
      return this.demo_connector.getWeb3Provider();


    return null;
  }

  getAccountDetails() {

    const f = (providerName, chainId, account) => {

      const chainName = this.getChainName(chainId);

      return {

        providerName: providerName,
        chainId: chainId,
        chainName: chainName,
        account: account
      }
    }

    if (this.mm_connector.isConnected())
      return this.mm_connector.getAccountDetails(f);

    else if (this.wc_connector.isConnected())
      return this.wc_connector.getAccountDetails(f);
    else if (this.demo_connector.isConnected())
      return this.demo_connector.getAccountDetails(f);

    return {

      providerName: null,
      chainId: null,
      account: null
    }
  }
}

export function createMWCConnector() {
  return new t_multi_wallet_connect();
}
