/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const User = require('./lib/user');
const Project = require('./lib/project');

module.exports.User = User;
module.exports.Project = Project;
module.exports.contracts = [ User, Project ];
