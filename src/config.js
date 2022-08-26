import { createEngLang } from "./lang";

class t_config {

  providerURI;
  defaultChainId;
  sourceContract;
  wrapperContract;
  loadSegmentSize;
  lang;

  constructor() {

    this.developerMode = true;

    if (this.developerMode == true) {

      this.providerURI = "http://127.0.0.1:8545";
      this.defaultChainId = "0x29a";
      this.sourceContract = "0x0B0D1b85d526760E29b771268bB90e2e5cCd30a8";
      this.wrapperContract = "0xf68c5E6605e9EF0F1E2B46890261A28B60E0E8b8";
    }
    else {

      this.providerURI = "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk";
      this.defaultChainId = "0x1";
      this.sourceContract = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
      this.wrapperContract = "0x2Ebc386D7E6Ef1Af0EdcF2ED1c8E91f8f8A79Fe3";
    }

    this.loadSegmentSize = 50;
    this.lang = createEngLang();
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
