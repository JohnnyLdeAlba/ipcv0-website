import WalletConnect from "@walletconnect/client";
import WalletConnectProvider from "@walletconnect/web3-provider";

import QRCodeModal from "@walletconnect/qrcode-modal";
import { t_subscriptions } from "../subscriptions";

function connectEvent(wc_connector) {

  return (error, payload) => {

    if (error) {

      wc_connector.responce = {
        code: "PROVIDER_CONNECT_FAILED",
        payload: null
      };

      return;
    }

    const { accounts, chainId } = payload.params[0];

    if (chainId != wc_connector.defaultChainId) {

      wc_connector.disconnect();
      return;
    }

    wc_connector.web3_provider.enable();
    wc_connector.connected = true;
    wc_connector.chainId = chainId;
    wc_connector.account = accounts[0];

    wc_connector
      .processSubscription("connect",
        wc_connector.getAccountDetails());

    wc_connector.responce = {

      code: 0,
      payload: {
        accounts: accounts,
        payload: payload
      }

    };
  };
}

function sessionUpdateEvent(wc_connector) {

  return (error, payload) => {
      
    if (error) {

      wc_connector.responce = {
        code: "PROVIDER_SESSION_UPDATE_FAILED",
        payload: null
      };

      return;
    }

    const { accounts, chainId } = payload.params[0];

    wc_connector.connected = true;
    wc_connector.chainId = chainId;
    wc_connector.account = accounts[0];

    wc_connector
      .processSubscription("sessionUpdate",
        wc_connector.getAccountDetails());

    wc_connector.responce = {

      code: 0,
      payload: {
        accounts: accounts,
        payload: payload
      }
    };
  };
}

function factoryDisconnect(wc_connector) {

  return (error, payload) => {

    if (error) {

     wc_connector.responce = {
        code: "PROVIDER_DISCONNECT_FAILED",
        payload: null
      };

      return;
    }

    wc_connector
      .processSubscription("disconnect",
        wc_connector.getAccountDetails());

    wc_connector.responce = {
      code: 0,
      payload: null
    };
  };
}

class t_wallet_connect extends t_subscriptions {

  providerName;
  chainId;
  defaultChainId;
  account;
  provider;  
  web3_provider;
  providerURI;
  responce;
  connected;

  constructor() {

    super();

    this.provider = null;
    this.providerName = "WalletConnect";
    this.providerURI = "";
    this.web3_provider = null;
    this.chainId = null;
    this.defaultChainId = 1;
    this.account = null;
    this.responce = null;
    this.connected = false;
  }

  setProviderURI(uri) {
    this.providerURI = uri;
  }

  setDefaultChainId(chainId) {
    this.defaultChainId = chainId;
  }

  initialize() {
   
    const web3_provider = new WalletConnectProvider({	    
      rpc: { 1: this.providerURI },
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal
    });

    const provider = web3_provider.connector;
/*
    const web3_provider = new WalletConnectProvider({
      rpc: { 1: this.providerURI }
    });
*/
    this.provider = provider;
    this.web3_provider = web3_provider;

    const connect = connectEvent(this);
    const sessionUpdate = sessionUpdateEvent(this);
    const disconnect = factoryDisconnect(this);

    provider.on("connect", connect);
    provider.on("session_update", sessionUpdate);
    provider.on("disconnect", disconnect);
  }

  getWeb3Provider() {
    return this.web3_provider;
  }

  autoConnect(session) {

    if (typeof session == "undefined") {

      this.disconnect();
      return;
    }

    if (session.chainId != this.defaultChainId) {

      this.disconnect();
      return;
    }

    if (this.provider == null)
      this.initialize();

    const wc_connector = this;

    this.addSubscriber(
      "sessionUpdate", "wcAutoConnect", () => {

      wc_connector.removeSubscriber(
        "sessionUpdate", "wcAutoConnect");

      if (session.account != wc_connector.account) {

        this.disconnect();
        return;
      }
    });

    this.web3_provider.enable();
    this.provider.updateSession({
      chainId: session.chainId,
      accounts: [ session.account ]
    });
  }

  connect() {

    if (this.provider == null)
      this.initialize();

    if (this.provider.connected)
      this.disconnect();

    let intervalId = setInterval(() => { 

      if (this.provider == null ||
          this.provider?.connected == false) {

        this.provider = null;
        this.initialize();

        this.provider.createSession();


        clearInterval(intervalId);
      }

    }, 10);
  }

  disconnect() {

    if (this.provider?.connected)
      this.provider.killSession();

    this.connected = false;
    this.chainId = null;
    this.account = null;
    this.provider = null;
    this.web3_provider = null;
  }

  isConnected() {
    return this.connected;
  }

  getAccountDetails(f) {

    if (typeof f == 'undefined') {

      return {

        providerName: this.providerName,
        chainId: this.chainId,
        account: this.account
      }
    }

    return f(
      this.providerName,
      this.chainId,
      this.account
    );
  }
}

export function createWCConnector() {
  return new t_wallet_connect;
}
