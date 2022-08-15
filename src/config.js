class t_config {

  providerURI;

  constructor() {
    this.providerURI = process.env.ALCHEMY_URI;
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
