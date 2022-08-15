import sourceABI from "./ipc-contract-abi.json";
import wrapperABI from "./ipc-wrapper-abi.json";

import { ethers } from "ethers";
import { t_subscriptions } from "./subscriptions"

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

    this.createEvent("pending");

    const web3_provider = this.mwc_provider.getWeb3Provider();
    const provider = new ethers.providers.Web3Provider(web3_provider);

    const signer = provider.getSigner();
    const sourceContract = new ethers.Contract(
      this.sourceAddress, sourceABI, signer);

    const wrapperContract = new ethers.Contract(
      this.wrapperAddress, wrapperABI, signer);

    sourceContract.on("ApprovalForAll", () => {});
    sourceContract.on("Approval", () => {});

    wrapperContract.on("Wrapped", (tokenIndex, tokenId, ownerAddress) => {});
    wrapperContract.on("Unwrapped", (tokenIndex, tokenId, ownerAddress) => {});

    this.provider = provider;
    this.sourceContract = sourceContract;
    this.wrapperContract = wrapperContract;
  }

  disconnect() {

    this.provider = null;
    this.sourceContract = null;
    this.wrapperContract = null;
  }

  async setApprovalForAll(tokenId) {

    console.log(this.provider);

    if (this.provider == null)
      return false;
    
    const signer = this.provider.getSigner();

    let message = await this.sourceContract
      .approve(this.wrapperAddress, tokenId)
        .catch((error) => {
          console.log(error);
        });

    return true;
  }
}

export function createIPCContract() {
  return new t_ipc_contract();
}
