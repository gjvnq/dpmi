const DPMIRegistry = artifacts.require("DPMIRegistry");

module.exports = function (deployer) {
  deployer.deploy(DPMIRegistry);
};
