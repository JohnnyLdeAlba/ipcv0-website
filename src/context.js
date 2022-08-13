import { t_subscriptions } from "./lib/subscriptions";
import { createMWCProvider } from "./lib/MultiWalletConnect/MWCProvider";
import { getTheme } from "./theme";

class t_settings {

  backdropVisible;

  constructor() {

    this.backdropVisible = true;
  }
}

export class t_context extends t_subscriptions {

  mwc_provider;
  settings;

  constructor() {

    super();

    this.mwc_provider = createMWCProvider();
    this.mwc_provider.subscriptions = this.subscriptions;
    this.mwc_provider.initialize();

    this.createSubscription("connect");
    this.createSubscription("disconnect");
    this.createSubscription("sessionUpdate");
    this.createSubscription("openMWCDialog");
    this.createSubscription("openAccountDialog");

    // this.addSubscriber("connect", "context", onConnectWallet);
    // this.addSubscriber("disconnect", "context", onDisconnectWallet);

    this.settings = new t_settings();
  }

  getSettings() { return this.settings; }
  getTheme() { return getTheme(); }

  getWalletProvider() {
    return this.mwc_provider;
  }
}

const context = new t_context();

export function getContext() {
  return context;
}
