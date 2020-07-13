/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class User extends Contract {

    async initLedger(ctx) {

    }

    async getUser(ctx, username, password) {
        const userAsBytes = await ctx.stub.getState('CONTRACTOR_'+username);
        if (!userAsBytes || userAsBytes.length === 0) {
            return {
                success: 'false',
                message: 'Contractor with username: \'' + username + '\' does not exist.'
            };
        }

        const user = JSON.parse(userAsBytes.toString());
        if(user.password !== password){
            return {
                success: 'false',
                message: 'Contractor authentication failed. Please retry with correct password.'
            };
        }

        return userAsBytes.toString();

    }

    async createUser(ctx, username, password) {
        const user = {
            username: username,
            docType: 'CONTRACTOR',
            password: password,
        };

        await ctx.stub.putState('CONTRACTOR_'+username, Buffer.from(JSON.stringify(user)));
        return {
            success: 'true'
        };
    }

}

module.exports = User;
