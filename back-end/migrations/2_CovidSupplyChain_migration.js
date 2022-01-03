const CovidSupplyChain = artifacts.require("./CovidSupplyChain.sol");

module.exports = function (deployer) {
    deployer.deploy(CovidSupplyChain);
}