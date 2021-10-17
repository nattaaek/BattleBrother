const BattleBrotherToken = artifacts.require("BattleBrotherToken");

module.exports = function (deployer) {
  deployer.deploy(BattleBrotherToken, "BattleBrotherTokens", "BBTS");
};
