/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Bid extends Contract {

    async applyForProject(ctx,username,projectID,bidDetails) {
        const bid = {
            username: username,
            docType: 'BID',
            projectID: projectID,
            bidDetails:bidDetails
        };
        const bidID=(new Date()).getTime().toString();
        await ctx.stub.putState('BID_'+bidID, Buffer.from(JSON.stringify(bid)));

        console.log(bid+' '+bidID);
        var applied = await ctx.stub.getState('APPLIED_'+projectID);
        if (!applied || applied.length === 0) {
            const temp={
                bids:[]
            }
            await ctx.stub.putState('APPLIED_'+projectID, Buffer.from(JSON.stringify(temp)));
        }
        applied = await ctx.stub.getState('APPLIED_'+projectID);
        applied.bids.push(bidID);
        await ctx.stub.putState('APPLIED_'+projectID, Buffer.from(JSON.stringify(applied)));

        return bidID.toString();

    }
    async getBid(ctx,bidID)
    {
        const bidAsBytes = await ctx.stub.getState('BID_'+bidID);
        if (!userAsBytes || userAsBytes.length === 0) {
            return {
                success: 'false',
                message: 'Invalid Bid ID'
            };
        }

        const bid = JSON.parse(userAsBytes.toString());

        return bid.toString();
    }

}

module.exports = Bid;
