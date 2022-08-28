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
      this.sourceContract = "0xB0E98CfB54aC4485e034F8634AeD784C6284a26f";
      this.wrapperContract = "0xc7348C0BCeE812B9920B40679B69f503B210a31f";
    }
    else {

      this.providerURI = "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk";
      this.defaultChainId = "0x1";
      this.sourceContract = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
      this.wrapperContract = "0x61E1eA57558B81c3B62578901502fe74D5a924c1";
    }

    this.loadSegmentSize = 50;
    this.lang = createEngLang();
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
