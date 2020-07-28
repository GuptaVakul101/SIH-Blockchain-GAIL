var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
const PaytmChecksum = require('./PaytmChecksum');

const cors = require('../../cors');
router.use(bodyParser.json());

router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

const callbackUrl="";
const custId="gail";

router.post('/initiateTransaction', async function(req, res, next) {
    var paytmParams = {};

    paytmParams.body = {
        "requestType"   : "Payment",
        "mid"           : req.body.mid,
        "websiteName"   : "WEBSTAGING",
        "orderId"       : req.body.orderId,
        "callbackUrl"   : callbackUrl,
        "txnAmount"     : {
            "value"     : req.body.value,
            "currency"  : "INR",
        },
        "userInfo"      : {
            "custId"    : custId,
        },
    };

    /*
    * Generate checksum by parameters we have in body
    * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
    */
    PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), req.body.merchantKey).then(function(checksum){

        paytmParams.head = {
            "signature"	: checksum
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {

            /* for Staging */
            hostname: 'securegw-stage.paytm.in',

            /* for Production */
            // hostname: 'securegw.paytm.in',

            port: 443,
            path: '/theia/api/v1/initiateTransaction?mid='+req.body.mid+'&orderId='+req.body.orderId,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            }
        };

        var response = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });

            post_res.on('end', function(){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            });
        });

        post_req.write(post_data);
        post_req.end();
    });
});
module.exports=router;