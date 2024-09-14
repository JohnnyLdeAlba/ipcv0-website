import { createEngLang } from "./lang";

class t_config {

  providerURI;
  defaultChainId;
  sourceContract;
  wrapperContract;
  loadSegmentSize;
  lang;

  constructor() {

    this.developerMode = false;

    if (this.developerMode == true) {

      this.providerURI = "http://127.0.0.1:8545";
      this.defaultChainId = "0x29a";
      this.sourceContract = "0x6dA606FA936f89A1626b5AAE64a95bE47E5c2F03";
      this.wrapperContract = "0x1EE78D4eae774ABBfce59571ED6D410C9670C431";
    }
    else {

      this.providerURI = "";
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
