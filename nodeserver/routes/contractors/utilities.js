var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

exports.authenticate=async function (username,password){
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric', 'test-network', 'organizations',
    'peerOrganizations', 'contractors.example.com', 'connection-contractors.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(username);
    if(!identity){
        return false;
    }
    else {
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: username,
            discovery: { enabled: true, asLocalhost: true } });
        const dictionary=JSON.parse(fs.readFileSync(path.resolve(__dirname,'dictionary.json'), 'utf8'));
        var channelNum=dictionary[username];
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channelg1c'+channelNum);

        // Get the contract from the network.
        const contract = network.getContract('contractors_1_'+channelNum);

        const user = await contract.evaluateTransaction('getUser', username, password);
        await gateway.disconnect();
        const userJson=JSON.parse(user,'utf8');
        if(userJson.hasOwnProperty('success')){
            return false;
        }
        else {
            return true;
        }
    }
};
