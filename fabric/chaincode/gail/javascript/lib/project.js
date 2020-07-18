/*
* Copyright IBM Corp. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*/
 
'use strict';
 
const { Contract } = require('fabric-contract-api');
 
class Project extends Contract {
   async initLedger(ctx) {
       // Number of projects floated for id calculation
       const numProjects = {
           numProjects: '0',
           docType: 'NUMPROJECTS'
       }
       await ctx.stub.putState('NUMPROJECTS', Buffer.from(JSON.stringify(numProjects)));
       return {
           success: 'true'
       };
   }
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

   async getProject(ctx, id){
    const projectAsBytes = await ctx.stub.getState('PROJECT_'+id);
    if (!projectAsBytes || projectAsBytes.length === 0) {
        return {
            success: 'false',
            message: 'Project with id: \'' + id + '\' does not exist.'
        };
    }
    return projectAsBytes.toString();
    
   }
  
   async getNumProjects(ctx){
       const numProjectsAsBytes = await ctx.stub.getState('NUMPROJECTS');
       if (!numProjectsAsBytes || numProjectsAsBytes.length === 0) {
           return {
               success: 'false',
               message: 'NUMPROJECTS does not exist.'
           };
       }
       return numProjectsAsBytes.toString();
   }
   async incrementNumProjects(ctx){
       const numProjectsAsBytes = await ctx.stub.getState('NUMPROJECTS');
       if (!numProjectsAsBytes || numProjectsAsBytes.length === 0) {
           return {
               success: 'false',
               message: 'NUMPROJECTS does not exist.'
           };
       }
 
       const numProjects = JSON.parse(numProjectsAsBytes.toString());
       numProjects.numProjects += '1';
 
       await ctx.stub.putState('NUMPROJECTS', Buffer.from(JSON.stringify(numProjects)));
       return {
           success: 'true'
       };
   }
}
 
module.exports = Project;
 

