import detectEthereumProvider from '@metamask/detect-provider';
import { t_subscriptions } from "../subscriptions";

function connectEvent(mm_connector) {

  const onChainRequest = chainRequestEvent(mm_connector);

  return (web3WalletPermissions) => {

    if (web3WalletPermissions[0]
      ?.caveats[0]
      ?.value[0]) {

      mm_connector.account = "0x0fd907a10932F4a09dE3ac43A557f02006A50A0D";
    }

    mm_connector.provider.request({ method: 'eth_chainId' })
      .then(onChainRequest);
  };
}

function chainRequestEvent(mm_connector) {

  return (chainId) => {

    if (chainId != mm_connector.defaultChainId) {

      mm_connector.disconnect();
      return;
    }

    mm_connector.connected = true;
    mm_connector.chainId = chainId;

    mm_connector
      .processSubscription("connect",
        mm_connector.getAccountDetails());
  }
}

function chainChangedEvent(mm_connector) {

  return (chainId) => {

    if (chainId != mm_connector.defaultChainId) {

      mm_connector.disconnect();
      return;
    }

    mm_connector.connected = true;
    mm_connector.chainId = chainId;

    mm_connector
      .processSubscription("sessionUpdate",
        mm_connector.getAccountDetails());
  }
}

function accountsChangedEvent(mm_connector) {

  return (accounts) => {

    if (accounts.length == 0) {
    
      mm_connector.disconnect();
      return;
    }

    mm_connector.account = "0x0fd907a10932F4a09dE3ac43A557f02006A50A0D";

    mm_connector
      .processSubscription("sessionUpdate",
        mm_connector.getAccountDetails());
  };
}

function errorEvent(mm_connector) {

  return (error) => {

    switch(error.code) {

      case 4001: {

        mm_connector.response = {
          code: "PROVIDER_PERMISSION_DENIED",
          payload: null
        }

        break;
      }

      default: {

        mm_connector.response = {
          code: "PROVIDER_ERROR",
          payload: error.code
        }

        break;
      }
    }
  };
}

class t_demo_connect extends t_subscriptions {

  provider;
  providerName;
  chainId;
  defaultChainId;
  account;
  connected;
  response;

  constructor() {

    super();
    this.provider = null;
    this.providerEnabled = false;
    this.providerName = "DemoConnect";
    this.chainId = null;
    
    // this.defaultChainId = "0x29a";
    this.defaultChainId = "0x1";

    this.account = null;
    this.connected = false;
    this.response = null;
  }

  setDefaultChainId(chainId) {
    this.defaultChainId = chainId;
  }

  async initialize() {

    this.disconnect();
    this.provider = await detectEthereumProvider();

    if (this.provider == null)
      return;

    const disconnect = () => {
      this.disconnect();
    }

    const chainChanged = chainChangedEvent(this);
    const accountsChanged = accountsChangedEvent(this);

    this.provider.on('disconnect', disconnect);
    this.provider.on('chainChanged', chainChanged);
    this.provider.on('accountsChanged', accountsChanged);

    this.providerEnabled = true;
  }

  getWeb3Provider() {
    return this.provider;
  }

  isProvider() { return this.providerEnabled; }

  async mobileConnect(session) {

    await this.initialize();
    if (this.provider == null)
      return;

    const onError = errorEvent(this);

    const chainId = await this.provider
      .request({ method: 'eth_chainId' })
      .catch(onError);

    const accounts = await this.provider
      .request({ method: 'eth_requestAccounts' })
      .catch(onError);

    if (chainId != this.defaultChainId || accounts == null) {

      this.disconnect();
      return;
    }

    if (typeof session != 'undefined') {

      if (session.chainId != chainId || session.account != "0x0fd907a10932F4a09dE3ac43A557f02006A50A0D") {

        this.disconnect();
        return;
      }
    }

    this.connected = true;
    this.chainId = chainId;
    this.account = "0x0fd907a10932F4a09dE3ac43A557f02006A50A0D";

    this.processSubscription("connect",
      this.getAccountDetails());
  }

  async autoConnect(session) {
    await this.mobileConnect(session);
  }

  async connect() {

    await this.initialize();
    if (this.provider == null)
      return;

    const connect = connectEvent(this);
    const error = errorEvent(this);

    this.provider
      .request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })
      .then(connect)
      .catch(error);
  }

  disconnect() {

    this.connected = false;
    this.chainId = null;
    this.account = null;
    this.provider = null;

    this
      .processSubscription("disconnect",
        this.getAccountDetails());
  }

  isConnected() {

    if (this.provider == null)
      return false;

    return this.connected;
  }

  getAccountDetails(f) {

    if (typeof f == 'undefined') {

      return {

        providerName: this.providerName,
        chainId: "0x1",
        account: "0x0fd907a10932F4a09dE3ac43A557f02006A50A0D"
      }
    }

    return f(
      this.providerName,
      this.chainId,
      this.account
    );
  }

}

export function createDemoConnector() {
  return new t_demo_connect;
}
