class t_config {

  providerURI;

  constructor() {
    this.providerURI = "";
  }
};

const config = new t_config();

export function getConfig() {
  return config;
}
