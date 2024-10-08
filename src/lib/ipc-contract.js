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

  return "";
}

function approvalEvent(ipc_contract) {

  return (owner, approved, tokenId) => {

    ipc_contract.processSubscription(
      "approval",
      [ owner, approved, tokenId ]
    );
  }
}

function approvalForAllEvent(ipc_contract) {

  return (owner, operator, approved) => {

    ipc_contract.processSubscription(
      "approvalForAll",
      [ owner, operator, approved ]
    );
  }
}

function wrappedEvent(ipc_contract) {

  return (tokenId, owner) => {

    ipc_contract.processSubscription(
      "wrapped",
      [ tokenId, owner ]
    );
  }
}

function unwrappedEvent(ipc_contract) {

  return (tokenId, owner) => {

    ipc_contract.processSubscription(
      "unwrapped",
      [ tokenId, owner ]
    );
  }
}

function wrapXEvent(ipc_contract) {

  return (owner, wrapTokens) => {

    ipc_contract.processSubscription(
      "wrapX",
      [ owner, wrapTokens ]
    );
  }
}

class t_ipc_contract extends t_subscriptions {

  sourceAddress;
  wrapperAddress;

  providerURI;
  mwc_connector;
  provider;
  defaultProvider;

  sourceContract;
  wrapperContract;

  constructor() {

    super();

    this.sourceAddress = config.sourceContract;
    this.wrapperAddress = config.wrapperContract;

    this.providerURI = null;
    this.mwc_connector = null;
    this.provider = null;
    this.defaultProvider = null;
    this.approvalForAll = false;

    this.sourceContract = null;
    this.wrapperContract = null;
  }

  async initialize() {

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

    this.mwc_connector.addSubscriber("connect", "ipcContract",
      () => { this.connect(); });
    this.mwc_connector.addSubscriber("sessionUpdate", "ipcContract",
      () => { this.connect(); });
    this.mwc_connector.addSubscriber("disconnect", "ipcContract",
      () => { this.disconnect(); });

    this.createSubscription("approval");
    this.createSubscription("approvalForAll");
    this.createSubscription("wrapped");
    this.createSubscription("unwrapped");
    this.createSubscription("wrapX");
  }

  connect() {

    let web3_provider = this.mwc_connector.getWeb3Provider();

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
    wrapperContract.on(wrapperContract.filters.WrapX(null, null), wrapXEvent(this));

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

    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, this.defaultProvider);

    const accountDetails = this.mwc_connector.getAccountDetails();
    if (accountDetails.account == null)
      return false;

    const approvedAddress = await sourceContract
      .isApprovedForAll(accountDetails.account, this.wrapperAddress)
      .catch(error => {  console.log(error); return false; } );

    return approvedAddress;
  }

  async isApproved(tokenId) {

    if (this.defaultProvider == null)
      return false;

    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, this.defaultProvider);

    const approvedAddress = await sourceContract
      .getApproved(tokenId)
      .catch(error => false );

    const approved = this.wrapperAddress == approvedAddress ? true : false;
    return approved;
  }

  async setApprovalForAll(enabled) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    const tx = await this.sourceContract
      .connect(signer)
      .setApprovalForAll(this.wrapperAddress, enabled)
      .catch((error) => {
        return { code: -1, payload: parseTx(error) };
      });

    if (typeof tx.code == "undefined")
      return { code: 0, payload: parseTx(tx) };

    return tx;
  }

  async approve(tokenId) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    const tx = await this.sourceContract
      .connect(signer)
      .approve(this.wrapperAddress, tokenId)
      .catch((error) => {
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

  // Need to handle when all tokens are wrapped. It reverts possibly due to zero tokens.
  async wrapX(total, wrapTokens) {

    if (this.provider == null)
      return { code: -1, payload: "NOT_CONNECTED" };
    
    const signer = this.provider.getSigner();

    wrapTokens = typeof wrapTokens == "undefined" ||
      wrapTokens == true ? true : false;

    const tx = await this.wrapperContract
      .connect(signer)
      .wrapX(total, wrapTokens)
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
