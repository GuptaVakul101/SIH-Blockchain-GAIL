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
            //correct username and password, proceed further to find the winner bidID for given projectID
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: req.body.username,
            discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('channelgg');
            const contract = network.getContract('gail', 'Project');
            const getProj = await contract.evaluateTransaction('getProject',req.body.id);
            await gateway.disconnect();
            const project = JSON.parse(getProj.toString());
            if("message" in project) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    success: false,
                    message: 'No project of project id-'+ req.body.id + ' found.'
                });
            }
            else{
                const gateway = new Gateway();
                await gateway.connect(ccp, { wallet, identity: req.body.username,
                discovery: { enabled: true, asLocalhost: true } });
                const network = await gateway.getNetwork('channelgg');
                const contract = network.getContract('gail', 'Bid');
                const allAppliedBids = await contract.evaluateTransaction('getProjectBids',req.body.id);
                const allAppliedBidsJson = JSON.parse(allAppliedBids.toString());
                if("message" in allAppliedBidsJson || allAppliedBidsJson.bids.length===0){
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({
                        success: false,
                        message: 'No applied bids for this project.'
                    });
                    await gateway.disconnect();
                }
                else{
                    const allAppliedBidIDsArray = allAppliedBidsJson.bids;
                    var winnerBidID;
                    var winningBidValue=0.0;
                    var maxPrice=0.0;
                    for(var i = 0; i < allAppliedBidIDsArray.length; i++){
                        const bidID = allAppliedBidIDsArray[i];
                        const getBid = await contract.evaluateTransaction('getBid',bidID);
                        const getBidJson = JSON.parse(getBid.toString());
                        if("message" in getBidJson){
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                success: false,
                                message: 'Some error in applied bid values.'
                            });
                            await gateway.disconnect();
                        }
                        else{
                            const getBidDetails = getBidJson.bidDetails;
                            const getBidDetailsJson = JSON.parse(getBidDetails.toString());
                            //console.log(getBidDetailsJson);
                            //console.log(getBidDetailsJson.price);
                            var price = parseFloat(getBidDetailsJson.price);
                            //console.log(price.toString());
                            if(price>maxPrice) maxPrice = price;
                        }
                    }

                    for(var i = 0; i < allAppliedBidIDsArray.length; i++){
                        const bidID = allAppliedBidIDsArray[i];
                        const getBid = await contract.evaluateTransaction('getBid',bidID);
                        const getBidJson = JSON.parse(getBid.toString());
                        if("message" in getBidJson){
                            res.statusCode = 400;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({
                                success: false,
                                message: 'Some error in applied bid values.'
                            });
                            await gateway.disconnect();
                        }
                        else{
                            const getBidDetails = getBidJson.bidDetails;
                            const getBidDetailsJson = JSON.parse(getBidDetails.toString());
                            const price = parseFloat(getBidDetailsJson.price);
                            const quality = parseFloat(getBidDetailsJson.quality);
                            const rating = parseFloat(getBidDetailsJson.rating);
                            var bidVal = (price/maxPrice)*600+300-quality*3+100-rating*10;
                            if(winningBidValue===0){
                                winnerBidID=bidID;
                                winningBidValue=bidVal;
                            }
                            else{
                                if(bidVal<winningBidValue){
                                    winningBidValue=bidVal;
                                    winnerBidID=bidID;
                                }
                            }
                        }
                    }

                    res.json({
                        success: true,
                        message: 'Winning bidID for project'+req.body.id+' is-'+winnerBidID 
                        // +' '+allAppliedBidIDsArray.length.toString()+' '+winningBidValue.toString()
                        //+' '+maxPrice.toString()
                    });

                }
            }
            
        }
    }
});

module.exports = router;