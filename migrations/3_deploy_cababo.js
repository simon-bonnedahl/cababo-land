const CBOToken = artifacts.require("CBOToken")

module.exports = function (deployer) {
    deployer.deploy(CBOToken)
}