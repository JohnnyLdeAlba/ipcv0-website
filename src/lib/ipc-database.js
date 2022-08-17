import { t_subscriptions } from "./subscriptions";
import { IPCLib } from "./ipc-lib";
import { getConfig } from "../config";

const config = getConfig();

class t_ipc_database extends t_subscriptions {

  subscriptions;
  ipc_contract;
  database;

  ownersBalance;
  ownersTokens;

  segment;
  segmentSize;

  constructor(context) {

    super();

    context = context ? context : null;
    if (context != null) {

      this.subscriptions = context.subscriptions
      this.ipc_contract = context.ipc_contract;
    }

    this.database = null;

    this.ownersBalance = -1;
    this.ownersTokens = null;
    this.segment = -1;
    this.segmentSize = config.loadSegmentSize;
  }

  async loadDatabase() {

    const json_database = await fetch("database.json", { cache: "force-cache" })
      .then(response => response.json());

    const database = [];

    for (let index = 0; index < json_database.length; index++)
      database[index] = IPCLib.ipc_create_label_ipc(json_database[index]);

    this.database = database;
  }

  async getOwnersUnwrappedTokens(owner, approved) {

    if (this.ownersBalance == 0)
      return -1;
    
    if (owner == null)
      return -1;

    approved = typeof approved == "undefined" ||
      approved == false ? false : true;

    if (this.ownersBalance == -1) {

      const balance = await this.ipc_contract.uwBalanceOf(owner);
      if (balance == 0)
        return -1;
 
      this.ownersBalance = balance;
    }

    const segmentTotalTokens = this.segmentTotalTokens();
    if (segmentTotalTokens >= this.ownersBalance)
      return -1;

    this.segment++;

    const tokenIdList = await this.ipc_contract
      .uwGetOwnersTokenIdList(
        owner,
	this.segment,
	this.segmentSize
    );

    if (tokenIdList == null)
      return -1;

    if (this.ownersTokens == null)
      this.ownersTokens = [];

    let token = null;
    for (let index = 0; index < tokenIdList.length; index++) {

      let token = this.database[tokenIdList[index] - 1];

      token.approved = approved;
      token.wrapped = false;
      this.ownersTokens.push(token);
    }

    return 0;
  }

  async getOwnersWrappedTokens(owner, approved) {

    if (this.ownersBalance == 0)
      return -1;
    
    if (owner == null)
      return -1;

    approved = typeof approved == "undefined" ||
      approved == true ? true : false;

    if (this.ownersBalance == -1) {

      const balance = await this.ipc_contract.wBalanceOf(owner);
      if (balance == 0)
        return -1;
 
      this.ownersBalance = balance;
    }

    const segmentTotalTokens = this.segmentTotalTokens();
    if (segmentTotalTokens >= this.ownersBalance)
      return -1;

    this.segment++;

    const tokenIdList = await this.ipc_contract
      .wGetOwnersTokenIdList(
        owner,
	this.segment,
	this.segmentSize
    );

    if (tokenIdList == null)
      return -1;

    if (this.ownersTokens == null)
      this.ownersTokens = [];

    let token = null;
    for (let index = 0; index < tokenIdList.length; index++) {

      let token = this.database[tokenIdList[index] - 1];

      token.approved = approved;
      token.wrapped = true;
      this.ownersTokens.push(token);
    }

    return 0;
  }

  clearOwnersTokens() {

    this.ownersTokens = null;
    this.ownersBalance = -1;
    this.segment = -1;
  }

  segmentTotalTokens() {
    return (this.segment * this.segmentSize) + this.segmentSize;
  }

  async requestOwnersTokens(owner, requestedTotalTokens, wrapped, approved) {

    let segmentTotalTokens = 0;

    if (this.segment == -1)
      segmentTotalTokens = -1;
    else
      segmentTotalTokens = this.segmentTotalTokens();

    if (this.ownersBalance != -1) {

      if (segmentTotalTokens >= this.ownersBalance)
        return -1;

      else if (requestedTotalTokens <= segmentTotalTokens)
        return -1;
    }

    wrapped = typeof wrapped == "undefined" ||
      wrapped == false ? false : true;

    approved = typeof approved == "undefined" ||
      approved == false ? false : true;

    let responce_id = 0;
    while (segmentTotalTokens < requestedTotalTokens) {

      if (wrapped == true)
        responce_id = await this.getOwnersWrappedTokens(owner, approved);
      else
        responce_id = await this.getOwnersUnwrappedTokens(owner, approved);

      if (responce_id < 0)
        break;

      segmentTotalTokens = this.segmentTotalTokens();
    }

    return 0;

  }

  getOwnersTokens(segment, total, approved) {
   
    if (this.ownersTokens == null)
      return null;

    approved = typeof approved == "undefined" ||
      approved == true ? true : false;

    let ownersTokens = [...this.ownersTokens];

    ownersTokens = ownersTokens.map(
      (ipc) => { ipc.approved = approved; return ipc; })

    ownersTokens = ownersTokens.slice(
      segment * total, (segment * total) + total);
  
    return ownersTokens;
  }
}

export function createIPCDatabase(context) {
  return new t_ipc_database(context);
}
