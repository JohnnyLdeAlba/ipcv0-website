import { createMMProvider } from "./MetaMaskProvider";
import { createWCProvider } from "./WalletConnectProvider";
import { t_subscriptions } from "../subscriptions"

class t_multi_wallet_connect extends t_subscriptions {

  defaultChainId;
  mm_provider;
  wc_provider;

  constructor() {

    super();

    this.defaultChainId = "0x1";
    this.mm_provider = null;
    this.wc_provider = null;
  }

  async initialize() {

    this.mm_provider = createMMProvider();
    this.wc_provider = createWCProvider();

    this.mm_provider.setDefaultChainId(this.defaultChainId);
    this.wc_provider.setDefaultChainId(this.defaultChainId);

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");

    this.mm_provider.subscriptions = this.subscriptions;
    this.wc_provider.subscriptions = this.subscriptions;

    await this.mm_provider.initialize();
    await this.wc_provider.initialize();
  }

  setProviderURI(uri) {
    this.wc_provider.setProviderURI(uri);
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

      if (this.mm_provider.mobileConnect())
        return true;
      else
        this.wc_provider.connect();
    }

    return true;
  }

  autoConnect(session) {

    switch (session.providerName) {

      case 'MetaMask': {

        this.mm_provider.autoConnect(session);
        return;
      }

      case 'WalletConnect': {

        this.wc_provider.autoConnect(session);
        return;
      }
    }
  }

  connect(id) {

    switch (id) {

      case 'METAMASK': {

        if (this.isMobile())
          this.mm_provider.mobileConnect();
        else
          this.mm_provider.connect();

        break;
      }

      default: {

        this.wc_provider.connect()
        break;
      }
    }
  }

  disconnect() {

    this.mm_provider.disconnect();
    this.wc_provider.disconnect();

    this.chainId = null;
    this.account = null;
  }

  isConnected() {

    if (this.mm_provider.isConnected())
      return true
    else if (this.wc_provider.isConnected())
      return true;

    return false;
  }

  getWeb3Provider() {

    if (this.mm_provider.isConnected())
      return this.mm_provider.getWeb3Provider();

    else if (this.wc_provider.isConnected())
      return this.wc_provider.getWeb3Provider();

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

    if (this.mm_provider.isConnected())
      return this.mm_provider.getAccountDetails(f);

    else if (this.wc_provider.isConnected())
      return this.wc_provider.getAccountDetails(f);

    return false;
  }
}

export function createMWCProvider() {
  return new t_multi_wallet_connect();
}
