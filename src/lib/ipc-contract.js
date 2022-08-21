import sourceABI from "./ipc-contract-abi.json";
import wrapperABI from "./ipc-wrapper-abi.json";

import { ethers } from "ethers";
import { t_subscriptions } from "./subscriptions";

function approvalEvent(ipc_contract) {

  return (owner, approved, tokenId) => {

    ipc_contract.processSubscription(
      "approval",
      [ "approval", owner, approved, tokenId ]
    );
  }
}

function approvalForAllEvent(ipc_contract) {

  return (owner, operator, approved) => {

    ipc_contract.processSubscription(
      "approvalForAll",
      [ "approvalForAll", owner, operator, approved ]
    );
  }
}

function wrappedEvent(ipc_contract) {

  return (tokenIndex, tokenId, owner) => {

    ipc_contract.processSubscription(
      "wrapped",
      [ "wrapped", tokenIndex, tokenId, owner ]
    );
  }
}

function unwrappedEvent(ipc_contract) {

  return (tokenIndex, tokenId, owner) => {

    ipc_contract.processSubscription(
      "unwraped",
      [ "unwrapped", tokenIndex, tokenId, owner ]
    );
  }
}

class t_ipc_contract extends t_subscriptions {

  sourceAddress;
  wrapperAddress;

  providerURI;
  mwc_provider;
  provider;
  defaultProvider;

  sourceContract;
  wrapperContract;

  constructor() {

    super();

    this.sourceAddress = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
    this.wrapperAddress = "0xD0f54E91ee2e57EA72B0836565E8dfFDb0a5F950";

    this.providerURI = null;
    this.mwc_provider = null;
    this.provider = null;
    this.defaultProvider = null;

    this.sourceContract = null;
    this.wrappereContract = null;
  }

  initialize() {

    this.defaultProvider = ethers.getDefaultProvider(
      "homestead",
      { alchemy: this.providerURI }
    );

    this.mwc_provider.addSubscriber("connect", "ipcContract",
      () => { this.connect(); });
    this.mwc_provider.addSubscriber("sessionUpdate", "ipcContract",
      () => { this.connect(); });
    this.mwc_provider.addSubscriber("disconnect", "ipcContract",
      () => { this.disconnect(); });

    this.createSubscription("approval");
    this.createSubscription("approvalForAll");
    this.createSubscription("wrapped");
    this.createSubscription("unwrapped");
  }

  connect() {

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

  async wBalanceOf(owner) {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const balance = await wrapperContract
      .balanceOf(owner)
        .catch(error => null);

    if (balance == null)
      return null;

    return balance;
  }

  async uwBalanceOf(owner) {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const balance = await wrapperContract
      .uwBalanceOf(owner)
        .catch(error => null);

    if (balance == null)
      return null;

    return balance;
  }

  async wGetOwnersTokenIdList(owner, startIndex, total) {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const ownersTokens = await wrapperContract
      .getTokensOfOwner(owner, startIndex, total)
        .catch(error => null);

    if (ownersTokens == null)
      return null;

    const ownersTokenIdList = ownersTokens.map(
      (ipc) => { return parseInt(ipc.tokenId._hex, 16) });

    return ownersTokenIdList;
  }

  async uwGetOwnersTokenIdList(owner, startIndex, total) {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const ownersTokens = await wrapperContract
      .uwGetTokensOfOwner(owner, startIndex, total)
        .catch(error => null);

    if (ownersTokens == null)
      return null;

    const ownersTokenIdList = ownersTokens.map(
      (ipc) => { return parseInt(ipc.tokenId._hex, 16) });

    return ownersTokenIdList;
  }

  async getLastIpc() {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const total = await wrapperContract.totalSupply()
      .catch(error => 0);

    if (total == 0)
      return null;

    const ipc = await wrapperContract.getIpc(total)
      .catch(error => null);
    if (ipc == null) return null;

    return ipc;
  }

  // need to listen for approveal for all mode set to update all buttons.

  async setApprovalForAll(tokenId) {

    if (this.provider == null)
      return false;
    
    const signer = this.provider.getSigner();

    const tx = await this.wrapperContract
      .connect(signer)
      .approve(this.wrapperAddress, tokenId)
        .catch((error) => {

        });

    return true;
  }
}

export function createIPCContract() {
  return new t_ipc_contract();
}
