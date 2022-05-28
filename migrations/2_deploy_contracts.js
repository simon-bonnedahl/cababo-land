const Land = artifacts.require("Land")

module.exports = async function (deployer) {
    const NAME = 'Cababo Land'
    const SYMBOL = 'CBO'


    await deployer.deploy(Land, NAME, SYMBOL)
}

