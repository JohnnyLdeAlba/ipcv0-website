import sourceABI from "./ipc-contract-abi.json";
import wrapperABI from "./ipc-wrapper-abi.json";

import { ethers } from "ethers";
import { t_subscriptions } from "./subscriptions";

import { getConfig } from "../config";

const config = getConfig();

function parseTx(tx) {

  if (typeof tx == "object")
    tx = JSON.stringify(tx);

  let match = tx.match(/\"hash\": ?\"(0x[A-Fa-f0-9]*)\"/);
  if (match != null)
    return match[1];

  match = tx.match(/revert:? ([A-Z0-9_]*)/);
  if (match != null)
    return match[1];

  match = tx.match(/reverted:? ([A-Z0-9_]*)/);
  if (match != null)
    return match[1];

  return null;
}

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

  return (tokenId, owner) => {

    ipc_contract.processSubscription(
      "wrapped",
      [ "wrapped", tokenId, owner ]
    );
  }
}

function unwrappedEvent(ipc_contract) {

  return (tokenId, owner) => {

    ipc_contract.processSubscription(
      "unwrapped",
      [ "unwrapped", tokenId, owner ]
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

    this.sourceAddress = config.sourceContract;
    this.wrapperAddress = config.wrapperContract;

    this.providerURI = null;
    this.mwc_provider = null;
    this.provider = null;
    this.defaultProvider = null;

    this.sourceContract = null;
    this.wrapperContract = null;
  }

  initialize() {

    if (config.developerMode == true) {

      this.defaultProvider = new ethers.providers
        .JsonRpcProvider(this.providerURI);
    }
    else {

      this.defaultProvider = ethers.getDefaultProvider(
        "homestead",
        { alchemy: this.providerURI }
      );
    }

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

    // this.wrap(0);
  }

  connect() {

    const web3_provider = this.mwc_provider.getWeb3Provider();
    if (web3_provider == null)
      return;

    const provider = new ethers.providers.Web3Provider(web3_provider);

    const signer = provider.getSigner();
    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, signer);

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, signer);

    sourceContract.on("ApprovalForAll", approvalForAllEvent(this));
    sourceContract.on("Approval", approvalEvent(this));

    wrapperContract.on(wrapperContract.filters.Wrapped(null, null), wrappedEvent(this));
    wrapperContract.on(wrapperContract.filters.Unwrapped(null, null), unwrappedEvent(this));

    this.provider = provider;
    this.sourceContract = sourceContract;
    this.wrapperContract = wrapperContract;
  }

  disconnect() {

    this.provider = null;
    this.sourceContract = null;
    this.wrapperContract = null;
  }

  async totalSupply() {

    if (this.defaultProvider == null)
      return null;

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, this.defaultProvider);

    const total = await wrapperContract.totalSupply()
      .catch(error => 0);

    return total;
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
      .wGetTokensOfOwner(owner, startIndex, total)
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

  async isApprovedForAll() {

    if (this.defaultProvider == null)
      return false;

    if (this.provider == null)
      return false;

    const signer = this.provider.getSigner();

    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, this.defaultProvider);

    const approvedForAll = await sourceContract
      .isApprovedForAll(
        signer.address,
	this.wrapperAddress)
      .catch(error => false);

    return approvedForAll;
  }

  async isApproved(tokenId) {

    if (this.defaultProvider == null)
      return false;

    if (this.provider == null)
      return false;

    const signer = this.provider.getSigner();

    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, this.defaultProvider);

    const approvedAddress = await sourceContract
      .getApproved(tokenId)
      .catch(error => {   console.log(error);  return "";  } );

    const approved = this.wrapperAddress == approvedAddress ? true : false;
    return approved;
  }

  async setApprovalForAll(tokenId) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    // old contract here....
    const tx = await this.sourceContract
      .connect(signer)
      .approve(this.wrapperAddress, tokenId)
        .catch((error) => {
          console.log(error);
          return false;
        });

    console.log(tx);

    return true;
  }

  async approve(tokenId) {

    console.log(this.provider);

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    const tx = await this.sourceContract
      .connect(signer)
      .approve(this.wrapperAddress, tokenId)
      .catch((error) => {
	      console.log(error);
        return { code: -1, payload: parseTx(error) };
      });

    if (typeof tx.code == "undefined")
      return { code: 0, payload: parseTx(tx) };

    return tx;
  }

  async wrap(tokenId) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    const tx = await this.wrapperContract
      .connect(signer)
      .wrap(tokenId)
      .catch((error) => {
        return { code: -1, payload: parseTx(error) };
      });

    if (typeof tx.code == "undefined")
      return { code: 0, payload: parseTx(tx) };

    return tx;
  }

  async unwrap(tokenId) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    const tx = await this.wrapperContract
      .connect(signer)
      .unwrap(tokenId)
      .catch((error) => {

        return { code: -1, payload: parseTx(error) };
      });

    if (typeof tx.code == "undefined")
      return { code: 0, payload: parseTx(tx) };

    return tx;
  }
}

export function createIPCContract() {
  return new t_ipc_contract();
}
