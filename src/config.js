class t_config {

  providerURI;
  maxOwnerTotal;

  constructor() {

    this.providerURI = "https://eth-mainnet.g.alchemy.com/v2/SYJS-Zaeo1W7JJNFsV8-ZeUJigU5VyNk";
    this.maxOwnerTotal = 200;
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
