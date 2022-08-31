import { t_subscriptions } from "./lib/subscriptions";
import { createMWCConnector } from "./lib/MultiWalletConnect/MWCConnector";
import { createIPCContract } from "./lib/ipc-contract";
import { createIPCDatabase } from "./lib/ipc-database";
import { IPCLib } from "./lib/ipc-lib";

import { getConfig } from "./config";
import { getTheme } from "./theme";

class t_about {

  serial;
  setUpdate;

  constructor() {

    this.serial = 0;
    this.setUpdate = () => {};
  }

  update() {
    this.setUpdate(++this.serial);
  }
}

export class t_wrap_panel {

  serial;
  mounted;
  visible;
  wrapped;
  sortBy;
  orderBy;
  rowsPerPage;
  page;
  totalPages;
  setWrapPanel;
  showWrapPanel;

  constructor() {

    this.serial = 0;
    this.mounted = false;
    this.visible = false;
    this.wrapped = false;
    this.sortBy = "tokenId";
    this.orderBy = "asc";
    this.rowsPerPage = 10;
    this.page = 0;
    this.totalPages = 0;
    this.setWrapPanel = (wrap_panel) => {};
    this.showWrapPanel = (visible) => {};
  }

  clone() {
    
    const wrap_panel = new t_wrap_panel();

    wrap_panel.serial = this.serial;
    wrap_panel.mounted = this.mounted;
    wrap_panel.visible = this.visible;
    wrap_panel.wrapped = this.wrapped;
    wrap_panel.sortBy = this.sortBy;
    wrap_panel.orderBy = this.orderBy;
    wrap_panel.rowsPerPage = this.rowsPerPage;
    wrap_panel.page = this.page;
    wrap_panel.totalPages = this.totalPages;
    wrap_panel.setWrapPanel = this.setWrapPanel
    wrap_panel.showWrapPanel = this.showWrapPanel;

    return wrap_panel;
  }

  show(visible) {

    this.visible = visible;
    this.showWrapPanel(visible);
    this.setWrapPanel(this.clone());
  }

  update() {

    this.serial++;
    this.setWrapPanel(this.clone());
  }
}

function onConnectWallet(event_id, subscriber_id, accountDetails) {

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

  mwc_connector;
  ipc_contract;
  ipc_database;

  about;
  wrap_panel;

  constructor() {

    super();

    this.mwc_connector = null;
    this.ipc_contract = null;
    this.ipc_database = null;

    this.about = null;
    this.wrap_panel = null
  }

  async initialize() {

    const config = this.getConfig();

    this.mwc_connector = createMWCConnector();
    this.mwc_connector.setDefaultChainId(config.defaultChainId);

    this.mwc_connector.subscriptions = this.subscriptions;
    this.mwc_connector.initialize();

    this.ipc_contract = createIPCContract();
    this.ipc_contract.providerURI = config.providerURI;
    this.ipc_contract.mwc_connector = this.mwc_connector;
    this.ipc_contract.subscriptions = this.subscriptions;

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");
    this.createSubscription("openMWCDialog");
    this.createSubscription("openAccountDialog");
    this.createSubscription("sortWrapPanel");
    this.createSubscription("updateWrapPanel");
    this.createSubscription("wrapRowUnmount");
    this.createSubscription("approvalForAllUpdate");

    this.addSubscriber("connect", "context", onConnectWallet);
    this.addSubscriber("disconnect", "context", onDisconnectWallet);

    this.mwc_connector.setProviderURI(config.providerURI);
    this.ipc_contract.initialize();
    this.ipc_database = createIPCDatabase(this);

    this.about = new t_about();
    this.wrap_panel = new t_wrap_panel();

    await this.autoConnect();
    await this.ipc_database.loadDatabase();
  }

  getConfig() { return getConfig(); }
  getTheme() { return getTheme(); }
  getLang() { return getConfig().lang; }

  getWalletProvider() {
    return this.mwc_connector;
  }

  getSession() {

    this.session = {

      providerName: sessionStorage.getItem("providerName"),
      chainId: sessionStorage.getItem("chainId"),
      account: sessionStorage.getItem("account")
    };
  }

  getAccountDetails() {
    return this.mwc_connector.getAccountDetails();
  }

  autoConnect() {

    this.getSession();
    this.mwc_connector.autoConnect(this.session);
  }

  hideBackdrop() {

    this.processSubscription("hideCircular");   
    this.processSubscription("closeConnectDialog");
    this.processSubscription("closeAccountDialog");
    this.processSubscription("hideBackdrop");
    this.processSubscription("unlockBackdrop");
  }

  showCircular(visible) {

    if (visible) {

      this.processSubscription("showCircular");
      this.processSubscription("showBackdrop");
      this.processSubscription("lockBackdrop");
    }
    else 
      this.hideBackdrop();
  }

  openSnackbar(type, caption, content, link) {

    context.processSubscription(
      "openSnackbar",
      [ type, caption, content, link ]
    );
  }

  update() {

    this.about.mounted = false;
    this.wrap_panel.mounted = false;

    this.about.update();

    this.processSubscription(
      "updateWrapPanel"
    );
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
}

const context = new t_context();

export function getContext() {
  return context;
}
