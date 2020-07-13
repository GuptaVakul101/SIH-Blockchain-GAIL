/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Project extends Contract {

    async createProject(ctx, username, id, title, description) {
        const project = {
            username: username,
            docType: 'PROJECT',
            id: id,
            title: title,
            description: description,
            status: 'floated',
            contractor_id: null,
            bid_id: null
        };

        await ctx.stub.putState('PROJECT_'+id, Buffer.from(JSON.stringify(project)));
        return {
            success: 'true'
        };
    }
}

module.exports = Project;
