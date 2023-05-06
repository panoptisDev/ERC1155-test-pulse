const PolyMintFactory = artifacts.require("PolyMintFactory");

module.exports = function(deployer) {
  deployer.deploy(PolyMintFactory);
};