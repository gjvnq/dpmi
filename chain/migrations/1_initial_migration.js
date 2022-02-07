const DPMIRegistry = artifacts.require("DPMIRegistry");
const DPMIRegistryRandom = artifacts.require("DPMIRegistryRandom");

// https://docs.chain.link/docs/vrf-contracts/#polygon-matic-mumbai-testnet
const MUMBAI_VRF_COORDINATOR = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
const MUMBAI_LINK_TOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const MUMBAI_KEY_HASH = "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4";

module.exports = function (deployer) {
  // deployer.deploy(DPMIRegistry);
  deployer.deploy(DPMIRegistryRandom, MUMBAI_VRF_COORDINATOR, MUMBAI_LINK_TOKEN, MUMBAI_KEY_HASH);
};
