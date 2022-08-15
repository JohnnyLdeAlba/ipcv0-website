import sourceABI from "./ipc-contract-abi.json";
import wrapperABI from "./ipc-wrapper-abi.json";

import { ethers } from "ethers";
import { t_subscriptions } from "./subscriptions"

class t_ipc_contract extends t_subscriptions {

  sourceAddress;
  wrapperAddress;

  constructor() {

    super();

    this.sourceAddress = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
    this.wrapperAddress = "0xD0f54E91ee2e57EA72B0836565E8dfFDb0a5F950";
  }
}

export function createIPCContract() {
  return new t_ipc_contract();
}
