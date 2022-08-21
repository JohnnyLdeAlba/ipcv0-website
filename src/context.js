import { t_subscriptions } from "./lib/subscriptions";
import { createMWCProvider } from "./lib/MultiWalletConnect/MWCProvider";
import { createIPCContract } from "./lib/ipc-contract";
import { createIPCDatabase } from "./lib/ipc-database";
import { IPCLib } from "./lib/ipc-lib";

import { getConfig } from "./config";
import { getTheme } from "./theme";

function onConnectWallet(accountDetails) {

  sessionStorage.setItem("providerName", accountDetails.providerName);
  sessionStorage.setItem("chainId", accountDetails.chainId);
  sessionStorage.setItem("account", accountDetails.account);
}

function onDisconnectWallet() {

  sessionStorage.removeItem("providerName");
  sessionStorage.removeItem("chainId");
  sessionStorage.removeItem("account");
}

export class t_context extends t_subscriptions {

  mwc_provider;
  ipc_contract;
  ipc_database;

  constructor() {

    super();
    this.ipc_database = null;
  }

  async initialize() {

    const config = this.getConfig();

    this.mwc_provider = createMWCProvider();
    this.mwc_provider.subscriptions = this.subscriptions;
    this.mwc_provider.initialize();

    this.ipc_contract = createIPCContract();
    this.ipc_contract.providerURI = config.providerURI;
    this.ipc_contract.mwc_provider = this.mwc_provider;
    this.ipc_contract.subscriptions = this.subscriptions;

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");
    this.createSubscription("openMWCDialog");
    this.createSubscription("openAccountDialog");
    this.createSubscription("sortWrapPanel");
    this.createSubscription("updateWrapPanel");

    this.addSubscriber("connect", "context", onConnectWallet);
    this.addSubscriber("disconnect", "context", onDisconnectWallet);

    this.mwc_provider.setProviderURI(config.providerURI);
    this.ipc_contract.initialize();

    this.ipc_database = createIPCDatabase(this);

    await this.autoConnect();
    await this.ipc_database.loadDatabase();
  }

  getConfig() { return getConfig(); }
  getTheme() { return getTheme(); }

  getWalletProvider() {
    return this.mwc_provider;
  }

  getSession() {

    this.session = {

      providerName: sessionStorage.getItem("providerName"),
      chainId: sessionStorage.getItem("chainId"),
      account: sessionStorage.getItem("account")
    };
  }

  autoConnect() {

    this.getSession();
    this.mwc_provider.autoConnect(this.session);
  }

  hideBackdrop() {

    this.processSubscription("hideCircular");   
    this.processSubscription("closeConnectDialog");
    this.processSubscription("closeAccountDialog");
    this.processSubscription("hideBackdrop");
    this.processSubscription("lockBackdrop", false);
  }

  showCircular(visible) {

    if (visible) {

      this.processSubscription("showCircular");
      this.processSubscription("showBackdrop");
      this.processSubscription("lockBackdrop", true);
    }
    else 
      this.hideBackdrop();
  }
}

const context = new t_context();

export function getContext() {
  return context;
}
