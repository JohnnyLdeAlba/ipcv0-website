import { t_subscriptions } from "./lib/subscriptions";
import { getTheme } from "./theme";

export class t_context extends t_subscriptions {

  backdropVisible;

  constructor() {

    super();

    this.backdropVisible = true;
  }

  getTheme() { return getTheme(); }
}

const context = new t_context();

export function getContext() {
  return context;
}
