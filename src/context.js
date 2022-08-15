import { t_subscriptions } from "./lib/subscriptions";
import { createMWCProvider } from "./lib/MultiWalletConnect/MWCProvider";

import { IPCLib } from "./lib/ipc-lib";
import { getTheme } from "./theme";

class t_settings {

  constructor() {
  }
}

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
  settings;
  database;

  constructor() {
    super();

    this.database = null;
  }

  async initialize() {

    this.mwc_provider = createMWCProvider();
    this.mwc_provider.subscriptions = this.subscriptions;
    this.mwc_provider.initialize();

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");
    this.createSubscription("openMWCDialog");
    this.createSubscription("openAccountDialog");

    this.addSubscriber("connect", "context", onConnectWallet);
    this.addSubscriber("disconnect", "context", onDisconnectWallet);

    this.settings = new t_settings();

    this.autoConnect();
    await this.loadDatabase();
  }

  getSettings() { return this.settings; }
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

  async loadDatabase() {

    const json_database = await fetch("database.json", { cache: "force-cache" })
      .then(response => response.json());

    const database = [];

    for (let index = 0; index < json_database.length; index++)
      database[index] = IPCLib.ipc_create_label_ipc(json_database[index]);

    this.database = database;
  }

  getDatabase() { return this.database; }
}

const context = new t_context();

export function getContext() {
  return context;
}
