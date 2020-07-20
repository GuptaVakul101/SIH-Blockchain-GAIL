var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const FabricCAServices = require('fabric-ca-client');
const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const utility=require(path.join(__dirname,'utilities.js'));

const cors = require('../../cors');
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });



router.post('/applyForProject', async function(req, res, next) {
    const authCheck=utility.authenticate(req.body.username,req.body.password);
    //const authCheck=true;
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
        var contract = network.getContract('gail', 'Project');
        const project=await contract.evaluateTransaction('getProject', req.body.projectID);
        const projectJson = JSON.parse(project.toString());
        if("message" in projectJson) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                message: 'No project of this project id found'
            });
            await gateway.disconnect();
        }
        else{
            // Create a new gateway for connecting to our peer node.
            gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: 'admin',
                discovery: { enabled: true, asLocalhost: true } });

            // Get the network (channel) our contract is deployed to.
            network = await gateway.getNetwork('channelgg');
            // Get the contract from the network.
            contract = network.getContract('gail', 'Bid');
            var bidID=(new Date()).getTime().toString();
            await contract.submitTransaction('applyForProject', req.body.username, req.body.projectID,JSON.stringify(req.body.bidDetails),bidID);
            await gateway.disconnect();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: true,
                message: 'Successfully Bid',
                bidID:bidID.toString()
            });
        }




    }
});
module.exports=router;
