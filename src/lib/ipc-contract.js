import sourceABI from "./ipc-contract-abi.json";
import wrapperABI from "./ipc-wrapper-abi.json";

import { ethers } from "ethers";
import { t_subscriptions } from "./subscriptions"

function approvalEvent(ipc_contract) {

  return (owner, approved, tokenId) => {

    ipc_contract.processSubscription(
      "pendingTransactions",
      [ "approval", owner, approved, tokenId ]
    );
  }
}

function approvalForAllEvent(ipc_contract) {

  return (owner, operator, approved) => {

    ipc_contract.processSubscription(
      "pendingTransactions",
      [ "approvalForAll", owner, operator, approved ]
    );
  }
}

function wrappedEvent(ipc_contract) {

  return (tokenIndex, tokenId, owner) => {

    ipc_contract.processSubscription(
      "pendingTransactions",
      [ "wrapped", tokenIndex, tokenId, owner ]
    );
  }
}

function unwrappedEvent(ipc_contract) {

  return (tokenIndex, tokenId, owner) => {

    ipc_contract.processSubscription(
      "pendingTransactions",
      [ "unwrapped", tokenIndex, tokenId, owner ]
    );
  }
}

class t_ipc_contract extends t_subscriptions {

  sourceAddress;
  wrapperAddress;

  mwc_provider;
  provider;

  sourceContract;
  wrapperContract;

  constructor() {

    super();

    this.sourceAddress = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
    this.wrapperAddress = "0xD0f54E91ee2e57EA72B0836565E8dfFDb0a5F950";

    this.mwc_provider = null;
    this.provider = null;

    this.sourceContract = null;
    this.wrappereContract = null;
  }

  initialize() {

    this.mwc_provider.addSubscriber("connect", "ipcContract",
      () => { this.connect(); });
    this.mwc_provider.addSubscriber("sessionUpdate", "ipcContract",
      () => { this.connect(); });
    this.mwc_provider.addSubscriber("disconnect", "ipcContract",
      () => { this.disconnect(); });
  }

  connect() {

    this.createEvent("pendingTransactions");
    this.createEvent("cancelTransactions");

    const web3_provider = this.mwc_provider.getWeb3Provider();
    const provider = new ethers.providers.Web3Provider(web3_provider);

    const signer = provider.getSigner();
    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, signer);

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, signer);

    sourceContract.on("ApprovalForAll", approvalForAllEvent(this));
    sourceContract.on("Approval", approvalEvent(this));

    wrapperContract.on("Wrapped", wrappedEvent(this));
    wrapperContract.on("Unwrapped", unwrappedEvent(this));

    this.provider = provider;
    this.sourceContract = sourceContract;
    this.wrapperContract = wrapperContract;
  }

  disconnect() {

    this.provider = null;
    this.sourceContract = null;
    this.wrapperContract = null;
  }

  // need to listen for approveal for all mode set to update all buttons.
  // approve changes from pending to wrap
  // wrap hides and moves ipc to the back. (resort)
  // needs to open a window witrh transaction id.

  async setApprovalForAll(tokenId) {

    if (this.provider == null)
      return false;
    
    const signer = this.provider.getSigner();

    let message = await this.wrapperContract
      .approve(this.wrapperAddress, tokenId)
        .catch((error) => {

        });

    return true;
  }
}

export function createIPCContract() {
  return new t_ipc_contract();
}
