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

router.post('/', async function(req,res,next) {
    console.log("Checking");
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: false,
        message: 'You dont have permission to access this page' 
    });
});

router.post('/createProject', async function(req, res, next) {
	const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric', 'test-network', 'organizations',
    'peerOrganizations', 'gail.example.com', 'connection-gail.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(req.body.username);
    if (!identity) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            message: 'You dont have permission to access this page!!' 
        });
    }   
    else{
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.body.username,
            discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channelgg');

        // Get the contract from the network.
        const contract = network.getContract('gail', 'User');

        const user = await contract.evaluateTransaction('getUser', req.body.username, req.body.password);
        const jsonObj = JSON.parse(user.toString());
        console.log(jsonObj.success);
        await gateway.disconnect();

        if(jsonObj.success == "false") {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                message: 'You dont have permission to access this page!!' 
            });
        } 
        else {
            //correct username and password, proceed further to create new project
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: req.body.username,
            discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('channelgg');
            const contract = network.getContract('gail', 'Project');
            const incrementNumProjects = await contract.evaluateTransaction('incrementNumProjects');
            const numProjects = await contract.evaluateTransaction('getNumProjects');

            const project = await contract.evaluateTransaction('createProject', req.body.username, req.body.id, req.body.title, req.body.description);
            //const backproj = await contract.evaluateTransaction('getProject',req.body.id);
            const jsonObj = JSON.parse(project.toString());
            console.log("Project Creation: " + jsonObj.success);

            await gateway.disconnect();

            res.json({
                success: true,
                message: 'Successfully created a new Project ' 
            });

        }
    }

    
});
router.post('/getProject', async function(req, res, next) {
	const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric', 'test-network', 'organizations',
    'peerOrganizations', 'gail.example.com', 'connection-gail.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(req.body.username);
    if (!identity) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: false,
            message: 'You dont have permission to access this page!!' 
        });
    }   
    else{
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: req.body.username,
            discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('channelgg');

        // Get the contract from the network.
        const contract = network.getContract('gail', 'User');

        const user = await contract.evaluateTransaction('getUser', req.body.username, req.body.password);
        const jsonObj = JSON.parse(user.toString());
        console.log(jsonObj.success);
        await gateway.disconnect();

        if(jsonObj.success == "false") {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            res.json({
                success: false,
                message: 'You dont have permission to access this page!!' 
            });
        } 
        else {
            //correct username and password, proceed further to create new project
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: req.body.username,
            discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('channelgg');
            const contract = network.getContract('gail', 'Project');
            //const incrementNumProjects = await contract.evaluateTransaction('incrementNumProjects');
            //const numProjects = await contract.evaluateTransaction('getNumProjects');

            //const project = await contract.evaluateTransaction('createProject', req.body.username, req.body.id, req.body.title, req.body.description);
            const backproj = await contract.evaluateTransaction('getProject',req.body.id);
            const jsonObj = JSON.parse(backproj.toString());
            console.log("Project Creation: " + jsonObj.success);

            await gateway.disconnect();

            res.json({
                success: true,
                message: 'Successfully got the project ' + backproj
            });

        }
    }

    
});
module.exports = router;
