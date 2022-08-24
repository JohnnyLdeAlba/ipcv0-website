class t_config {

  providerURI;
  maxOwnerTotal;

  constructor() {

/*
    this.providerURI = "http://127.0.0.1:8545";
    this.defaultChainId = "0x29a";
    this.sourceContract = "0xC0E52c4A095805175eBDC655A83f2f03895CC68e";
    this.wrapperContract = "0xea558296e2AA66802962B9379f1b9BF702250597";
*/

    this.providerURI = "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk";
    this.sourceContract = "0x4787993750B897fBA6aAd9e7328FC4F5C126e17c";
    this.wrapperContract = "0x2Ebc386D7E6Ef1Af0EdcF2ED1c8E91f8f8A79Fe3";
    this.defaultChainId = "0x1";

    this.loadSegmentSize = 50;
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
