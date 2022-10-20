const erc1155 = artifacts.require('tokens');

module.exports = async (deployer) => { 
    
        await deployer.deploy(erc1155);
    }