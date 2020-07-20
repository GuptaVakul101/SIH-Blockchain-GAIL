var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const cors = require('../../cors');
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

function authenticate(username,password){
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric', 'test-network', 'organizations',
    'peerOrganizations', 'contractors.example.com', 'connection-contractors.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(req.body.username);
    if(!identity){
        return false;
    }
    else {
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: username,
            discovery: { enabled: true, asLocalhost: true } });
        const dictionary=JSON.parse(fs.readFileSync(path.resolve(__dirname,'dictionary.json'), 'utf8'));
        var channelNum=dictionary[req.body.username];
        console.log(dictionary);
        console.log(channelNum);
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
}

router.post('/applyForProject', async function(req, res, next) {
    const authCheck=authenticate(req.body.username,req.body.password);
    if(authCheck==false)
    {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            message: 'You dont have permission to access this page!!'
        });
    }
    else{
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric', 'test-network', 'organizations',
        'peerOrganizations', 'gail.example.com', 'connection-gail.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        var walletPath = path.resolve(__dirname, '..','gail','wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        var gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'admin',
            discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        var network = await gateway.getNetwork('channelgg');
        // Get the contract from the network.
        var contract = network.getContract('gail', 'Bid');
        const bidID=await contract.evaluateTransaction('applyForProject', req.body.username, req.body.projectID,req.body.bidDetails);
        await gateway.disconnect();

        //New transaction to add Bid ID to project
        gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.body.username,
        discovery: { enabled: true, asLocalhost: true } });
        network = await gateway.getNetwork('channelgg');
        contract = network.getContract('gail', 'Project');

        project = await contract.evaluateTransaction('addBid', req.body.projectID, bidID);

        await gateway.disconnect();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            message: 'Successfully Bid',
            bidID:bidID
        });

    }




}
