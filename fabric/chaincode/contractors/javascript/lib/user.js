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

    async createUser(ctx, username, password,email) {
        const user = {
            docType: 'CONTRACTOR',
            username: username,
            password: password,
            email:email,
            activeProjectID:null,
            activeBidID:null,
            listOfPreviousProjects:[],
            overallRating: '0'
        };

        await ctx.stub.putState('CONTRACTOR_'+username, Buffer.from(JSON.stringify(user)));
        return {
            success: 'true'
        };
    }
    async allocateProject(ctx,username,projectID,bidID){
        const userAsBytes = await ctx.stub.getState('CONTRACTOR_'+username);
        if (!userAsBytes || userAsBytes.length === 0) {
            return {
                success: 'false',
                message: 'Contractor with username: \'' + username + '\' does not exist.'
            };
        }
        var user = JSON.parse(userAsBytes.toString());
        user.activeProjectID=projectID;
        user.activeBidID=bidID;
        await ctx.stub.putState('CONTRACTOR_'+username, Buffer.from(JSON.stringify(user)));
    }
    async deallocateProject(ctx,username){
        const userAsBytes = await ctx.stub.getState('CONTRACTOR_'+username);
        if (!userAsBytes || userAsBytes.length === 0) {
            return {
                success: 'false',
                message: 'Contractor with username: \'' + username + '\' does not exist.'
            };
        }
        var user = JSON.parse(userAsBytes.toString());
        user.listOfPreviousProjects.push(projectID);
        user.activeProjectID=null;
        user.activeBidID=null;
        await ctx.stub.putState('CONTRACTOR_'+username, Buffer.from(JSON.stringify(user)));
    }

}

module.exports = User;
