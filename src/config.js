class t_config {

  providerURI;
  maxOwnerTotal;

  constructor() {

    this.developerMode = true;

    if (this.developerMode == true) {

      this.providerURI = "http://127.0.0.1:8545";
      this.defaultChainId = "0x29a";
      this.sourceContract = "0x09182dCd75c5e9f301039B5c43B21f44391c1804";
      this.wrapperContract = "0xA09eBAd369110568F6592Ad8Fc30F01bD0a7b833";
    }
    else {

      this.providerURI = "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk";
      this.defaultChainId = "0x1";
      this.sourceContract = "0x0721F63742158BEAE948c3C406b59d7b22C38A3b";
      this.wrapperContract = "0xc18a45985660C78309bbAA9908D21d47F24d66F3";
    }

    this.loadSegmentSize = 50;
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
