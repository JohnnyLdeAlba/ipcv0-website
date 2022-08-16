import { t_subscriptions } from "./subscriptions";
import { IPCLib } from "./ipc-lib";
import { getConfig } from "../config";

const config = getConfig();

class t_ipc_database extends t_subscriptions {

  subscriptions;
  ipc_contract;
  database;
  ownersTokens;

  constructor(context) {

    super();

    context = context ? context : null;
    if (context != null) {

      this.subscriptions = context.subscriptions
      this.ipc_contract = context.ipc_contract;
    }

    this.database = null;
    this.ownersTokens = null;
  }

  async loadDatabase() {

    const json_database = await fetch("database.json", { cache: "force-cache" })
      .then(response => response.json());

    const database = [];

    for (let index = 0; index < json_database.length; index++)
      database[index] = IPCLib.ipc_create_label_ipc(json_database[index]);

    this.database = database;
  }

  async getUnwrappedList(owner, approved) {

    if (owner == null)
      return null;

    approved = approved ? true : false;

    const balance = await this.ipc_contract.uwBalanceOf(owner);
    if (balance == 0)
      return null;

    if (balance > config.maxOwnerTotal)
      balance = config.maxOwnerTotal;

    const tokenList = []

    const tokenIdList = await this.ipc_contract
      .uwGetOwnersTokenIdList(owner, 0, balance);

    for (let index = 0; index < tokenIdList.length; index++) {

      const token = this.database[tokenIdList[index] - 1];

      token.approved = approved;
      tokenList.push(token);
    }

    tokenList.sort((a, b) => { return a.token_id - b.token_id });
    return tokenList;
  }

  async getWrappedList(owner, approved) {

    if (owner == null)
      return null;

    approved = approved ? true : false;

    const balance = await this.ipc_contract.wBalanceOf(owner);
    if (balance == 0)
      return null;

    if (balance > config.maxOwnerTotal)
      balance = config.maxOwnerTotal;

    const tokenList = []

    const tokenIdList = await this.ipc_contract
      .wGetOwnersTokenIdList(owner, 0, balance);

    for (let index = 0; index < tokenIdList.length; index++) {

      const token = this.database[tokenIdList[index] - 1];

      token.approved = approved;
      token.wrapped = true;
      tokenList.push(token);
    }

    tokenList.sort((a, b) => { return a.token_id - b.token_id });
    return tokenList;
  }

  async loadOwnersTokens(owner, approved, type, sort) {

    if (owner == null)
      return null;

    type = (typeof type == "undefined" || type == "wrapped") ? "wrapped" : "unwrapped";
    sort = (typeof sort == "undefined" || sort == "desc") ? "desc" : "asc";
    
    let ownersTokens = null;
    if (type == "wrapped")
      ownersTokens = await this.getWrappedList(owner, approved);
    else
      ownersTokens = await this.getUnwrappedList(owner, approved);

    if (ownersTokens == null)
      return null;

    if (sort == "desc")
      ownersTokens.sort((a, b) => { return b.token_id - a.token_id; });

    this.ownersTokens = ownersTokens;
    return ownersTokens;
  }

  getOwnersTokens(page, total, approved, sort) {

    if (this.ownersTokens == null)
      return null;

    approved = approved ? true : false;
    sort = sort ? "desc" : "asc";

    let ownersTokens = [...this.ownersTokens];

    if (sort == "desc")
      ownersTokens.sort((a, b) => { return b.token_id - a.token_id; });
    else
      ownersTokens.sort((a, b) => { return a.token_id - b.token_id; });

    ownersTokens = ownersTokens.map(
      (ipc) => { ipc.approved = approved; return ipc; })

    ownersTokens = ownersTokens.slice(
      page * total, (page * total) + total);
  
    return ownersTokens;
  }
}

export function createIPCDatabase(context) {
  return new t_ipc_database(context);
}
