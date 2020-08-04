# SIH'20 Blockchain GAIL
# BUILD INSTRUCTIONS

* **fabric** contains code for the Hyperledger Fabric blockchain network and chaincode (smart contracts).
* **nodeserver** contains the NodeJS and Express backend server code.
* **GAIL_client** contains the GAIL client website code.
* **Contractor_client** contains the Contractor client website code.

---

### Setting up dependencies

> Make sure all the required folders are removed while doing `./network.sh down`. If you are facing permission errors while removing the blockchain network, use `sudo chown -R $USER:$USER test-network`.

```shell
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

---

### Running the test network

> If you see this message: `WARNING: Connection pool is full, discarding connection: localhost`. That's because the python library `requests` maintains a pool of HTTP connections that the docker library uses. If we use docker-compose with more than 10 containers, this warning will occur. Solution is to change the `DEFAULT_POOLSIZE` of requests library in `~/.local/lib/python*.*/site-packages/requests/adapters.py` to `1000`.

```shell
# Install the required dependencies
./install.sh

# Deploy the blockchain network
fabric/test-network/network.sh up -ca

# Create all required channels between the peer nodes (between every pair of gail and contractor and other among all gail nodes)
fabric/test-network/network.sh createChannel

# Deploy chaincode to the channel created
fabric/test-network/network.sh deployCC

# Remove the blockchain network
fabric/test-network/network.sh down
```

OR

```shell
# Install the required dependencies
./install.sh

# Create the blockchain network
./restart.sh
```

---

### Running NodeJS backend server

```shell
# Install all the required dependencies
npm install

# Start the node server
npm start

# Open localhost:3000 in web browser
```

---

### Running NodeJS GAIL Client server

```shell
# Install all the required dependencies
npm install

# Start the node server
PORT=8000 node app.js

# Open localhost:3600 in web browser
```

---

### Running NodeJS Contractor Client server

```shell
# Install all the required dependencies
npm install

# Start the node server
node app.js

# Open localhost:4200 in web browser
```
---
---


# GAIL-BK225-Chaincode-Documentation

# Gail and Evaluators



1. Users

<table>
  <tr>
   <td>
<strong>Functions</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Create User</strong>
   </td>
   <td>Params: Model fields.
<ul>

<li>Username

<li>Password

<li>Email

<li>Address

<li>Profile Picture

<li>Team Name

<li>Designation: Gail User/Evaluator

<p>
Function: Saved as USER_&lt;Username> in blockchain db
<p>
Return: Void
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Get User</strong>
   </td>
   <td>Params: Username, Password
<p>
Return: JSON user data model with all fields
   </td>
  </tr>
  <tr>
   <td><strong>Get Num Contractors</strong>
   </td>
   <td>Params: Void \
Return: Number of Contractor/Shipping Agencies registered.
   </td>
  </tr>
  <tr>
   <td><strong>Update Num Contractors</strong>
   </td>
   <td>Params: Void \
Function: Increments number of Contractors/Shipping Agencies registered by 1. \
Return: Void
   </td>
  </tr>
</table>




2. Project

<table>
  <tr>
   <td>
<strong>Functions</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Create Project</strong>
   </td>
   <td>Params: Model fields
<ul>

<li>Username

<li>ProjectID: Automatic unique ID generated equal to number of projects registered by GAIL till now.

<li>Title

<li>Description

<li>Create Time Stamp

<li>Deadline: After the deadline is met, GAIL will be able to review all the applied bids and add it’s custom reviews.

<li>ContractorID: Initially NULL, later equal to assigned contractor

<li>BidID: Initially NULL, later equal to best evaluated bid

<li>Status: Floated/In-Progress/In-Shipment/In-Pre-Review/In-Review

<li>Progress: Array of descriptive timed logs

<li>Brochure: Uploaded in form of PDF

<p>
Function: Saved Model as PROJECT_&lt;ProjectID> in blockchain db
<p>
Return: Void
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Get Project</strong>
   </td>
   <td>Params: ProjectID
<p>
Return: JSON project data model with all fields
   </td>
  </tr>
  <tr>
   <td><strong>Get Num Projects</strong>
   </td>
   <td>Params: Void \
Return: Number of Projects registered by GAIL till now
   </td>
  </tr>
  <tr>
   <td><strong>Update Num Projects</strong>
   </td>
   <td>Params: Void \
Function: Increments number of Projects by 1 \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Update Project BidID</strong>
   </td>
   <td>Params: ProjectID, bidID \
Function: Updates field ‘bidID’ for project of &lt;ProjectID> \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Update Project ContractorID</strong>
   </td>
   <td>Params: ProjectID, contractorID \
Function: Updates field ‘contractorID’ for project of &lt;ProjectID> \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Update Project Progress</strong>
   </td>
   <td>Params: ProjectID, description, timestamp \
Function: Updates field ‘progress’ for project of &lt;ProjectID> as pushes JSON field having description and timestamp into the progress array. \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Update Project Status</strong>
   </td>
   <td>Params: ProjectID, status \
Function: Updates field ‘status’ for project of &lt;ProjectID> \
Return: Void
   </td>
  </tr>
</table>




3. Bid

<table>
  <tr>
   <td>
<strong>Functions</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Apply for Project</strong>
   </td>
   <td>Params: Model fields.
<ul>

<li>Username

<li>ProjectID

<li>BidID: AutoGenerated Unique ID generated by currentTimeStamp of application

<li>BidDetails: JSON of various params like price, ISO standards, rating,  product quality. (more can be added as per requirement)

<p>
Function: 
<ul>

<li>Saved as BID_&lt;BidID> in blockchain db

<li>Pushed to APPLIED_&lt;ProjectID> array of all applied bids of the given project in the blockchain dc.

<p>
Return: Void
</li>
</ul>
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Get Bid</strong>
   </td>
   <td>Params: BidID
<p>
Return: JSON bid data model with all fields
   </td>
  </tr>
  <tr>
   <td><strong>Get ProjectBids</strong>
   </td>
   <td>Params: ProjectID \
Return: Array of all the applied bids for given projectID.
   </td>
  </tr>
</table>



# Contractors and Shipping Agency



1. Users

<table>
  <tr>
   <td>
<strong>Functions</strong>
   </td>
   <td><strong>Description</strong>
   </td>
  </tr>
  <tr>
   <td><strong>Create User</strong>
   </td>
   <td>Params: Model fields.
<ul>

<li>Username

<li>Password

<li>Email

<li>Address

<li>Contact

<li>AboutUs

<li>ProfilePic

<li>ListOfPrevious Projects: Array of JSON of all previous allocated projects to the contractor by GAIL by params like ID, rating, quality, review.

<li>ActiveProjectID: NULL if no active project, otherwise equal to the projectID assigned to the contractor

<li>ActiveBidID: NULL if no active project, otherwise equal to the BidID that the contractor had applied for the allocated project.

<li>OverallRating: Average rating provided to the contractor based on past deals with GAIL

<li>OverallProductQuality: Average product/service quality provided to the contractor based on past deals with GAIL

<p>
Function: Saved as CONTRACTOR_&lt;Username> in blockchain db
<p>
Return: Void
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Allocate Project</strong>
   </td>
   <td>Params: ProjectID, BidID \
Function: Changes fields ‘activeProjectID’ from NULL to &lt;ProjectID> and ‘activeBidID’ from NULL to &lt;BidID> \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Dellocate Project</strong>
   </td>
   <td>Params: Username, Rating, Quality, Review \
Function: 
<ul>

<li>Changes fields ‘activeProjectID’ to NULL and ‘activeBidID’ to NULL

<li>Added JSON of id, current rating,quality,review in array of list of previous projects.

<p>
Return: Void
</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Get Num of Previous Projects</strong>
   </td>
   <td>Params: Void \
Function: Returns length of the array of previous projects in the project data model. \
Return: Void
   </td>
  </tr>
  <tr>
   <td><strong>Get/Update functions </strong>
   </td>
   <td>Params: Void(GET), &lt;value>(UPDATE)
<p>
Function: Query to blockchain db to fetch or put updated state accordingly.
   </td>
  </tr>
</table>






![alt_text](images/image1.png "image_tooltip")



# Project Lifecycle




![alt_text](images/image2.png "image_tooltip")



# DOMESTIC USE CASE




![alt_text](images/image3.png "image_tooltip")

---
---

# GAIL - BK225
# BLOCKCHAIN POWERED PROCUREMENT SYSTEM
# NodeServer API Documentation

<table>
  <tr>
   <td>Team Name
   </td>
   <td>CRYPTO-BUDS
   </td>
  </tr>
  <tr>
   <td>Team Leader
   </td>
   <td>Devaishi Tiwari
   </td>
  </tr>
  <tr>
   <td>Other Team Members
   </td>
   <td>Vakul Gupta, Chirag Gupta, Lavish Gulati, Utkarsh Jain, Niyati Chaudhary
   </td>
  </tr>
  <tr>
   <td>College Name
   </td>
   <td>Indian Institute of Technology, Guwahati
   </td>
  </tr>
</table>



# Introduction

For all our core functionalities, we have created REST API endpoints. These REST endpoints provide a means of abstraction between client and blockchain network and also encapsulate business logic. The APIs also have endpoints for payment functionality with third-party services (currently only Paytm is supported).

Broadly we can classify our API endpoints into three groups:



*   Contractor Services
*   GAIL Services
*   Payment Services



---



# Contractor Services

API services under this group cater to the use cases from the Contractor’s perspective.



---


**PATH**: /contractors/admin/signup

**METHOD**: POST

**BODY**: empty

**USAGE**: To register an admin for contractor users. Needed for the blockchain network wallet for contractors.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. True if successfully created admin. Otherwise false.



---


**PATH**: /contractors/users/signup

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
  <tr>
   <td>email
   </td>
   <td>string. Contractor email id.
   </td>
  </tr>
  <tr>
   <td>contact
   </td>
   <td>string, Contractor contact number.
   </td>
  </tr>
  <tr>
   <td>address
   </td>
   <td>string. Contractor address.
   </td>
  </tr>
  <tr>
   <td>aboutUs
   </td>
   <td>string. Contains a short description about contractor.
   </td>
  </tr>
  <tr>
   <td>profilePic
   </td>
   <td>string. Path of the contractor profile picture stored in the server.
   </td>
  </tr>
  <tr>
   <td>mid
   </td>
   <td>string. Paytm Merchant ID of the contractor.
   </td>
  </tr>
  <tr>
   <td>mkey
   </td>
   <td>string. Paytm Merchant Key of the contractor.
   </td>
  </tr>
</table>


**USAGE**: To register a new contractor.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. True if successfully created admin.Otherwise false.
*   username: string. Only returned if the user is successfully created. Contains the username of the new user.
*   message: string. Only returned if the user is not created. Contains the error message.



---


**PATH**: /contractors/users/login

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
</table>


**USAGE**: To authenticate a contractor

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. Only returned if authentication failed.Value is always false.
*   message: string. Only returned if authentication failed. Contains the error message.
*   username: string. Only returned if authentication success. Unique contractor username.
*   password: string. Only returned if authentication success. Contractor password.
*   email: string. Only returned if authentication success. Contractor email ID.
*   contact: string. Only returned if authentication success. Contractor contact number.
*   address: string. Only returned if authentication success. Contractor address.
*   aboutUs: string. Only returned if authentication success. Contains a short description of the contractor.
*   profilePic: string. Only returned if authentication success. Path of the contractor profile picture stored in the server.
*   mid: string. Only returned if authentication success. Paytm Merchant ID of the contractor.
*   mkey: string. Only returned if authentication success. Paytm Merchant Key of the contractor.



---


**PATH**: /contractors/users/profile

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
</table>


**USAGE**: To get the contractor profile

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned if the query failed. Contains the error message.
*   Object: JSON object. Contains contractor profile which contains the following fields:
*   username: string. Unique contractor username.
*   password: string. Contractor password.
*   email: string.Contractor email id.
*   contact: string.Contractor contact number.
*   address: string.Contractor address.
*   aboutUs: string. Contains a short description of the contractor.
*   profilePic: string. Path of the contractor profile picture stored in the server.
*   mid: string. Paytm Merchant ID of the contractor.
*   mkey: string. Paytm Merchant Key of the contractor.



---


**PATH**: /contractors/users/updateProfile

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
  <tr>
   <td>email
   </td>
   <td>string. Contractor email id.
   </td>
  </tr>
  <tr>
   <td>contact
   </td>
   <td>string, Contractor contact number.
   </td>
  </tr>
  <tr>
   <td>address
   </td>
   <td>string. Contractor address.
   </td>
  </tr>
  <tr>
   <td>aboutUs
   </td>
   <td>string. Contains a short description of the contractor.
   </td>
  </tr>
  <tr>
   <td>profilePic
   </td>
   <td>string. Path of the contractor profile picture stored in the server.
   </td>
  </tr>
  <tr>
   <td>mid
   </td>
   <td>string. Paytm Merchant ID of the contractor.
   </td>
  </tr>
  <tr>
   <td>mkey
   </td>
   <td>string. Paytm Merchant Key of the contractor.
   </td>
  </tr>
</table>


**USAGE**: To update contractor profile

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. Only returned if authentication failed.Value is always false.
*   message: string. Only returned if authentication failed. Contains the error message.
*   username: string. Only returned if update success. Unique contractor username.
*   password: string. Only returned if update success. Contractor password.
*   email: string. Only returned if update success. Contractor email id.
*   contact: string. Only returned if update success. Contractor contact number.
*   address: string. Only returned if update success. Contractor address.
*   aboutUs: string. Only returned if update success. Contains a short description about the contractor.
*   profilePic: string. Only returned if update success. Path of the contractor profile picture stored in the server.
*   mid: string. Only returned if update success. Paytm Merchant ID of the contractor.
*   mkey: string. Only returned if update success. Paytm Merchant Key of the contractor.



---


**PATH**: /contractors/users/getCompletedProjects

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
</table>


**USAGE**: Get all previous projects delivered by the contractor

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned if the query failed. Contains the error message.
*   allProjects: JSON array. Contains an array of project JSON objects which are completed by the contractor: Each project object contains the following fields :
    *   username: string. Username of GAIL client who created the project.
    *   id: string. Project ID.
    *   title: string. Project Title.
    *   description: string. Project description.
    *   status: string. Current project status.
    *   contractor_id: string. Username of the contractor to whom the project is allocated.
    *   bid_id :string. Winning Bid ID of the project
    *   progress: JSON array. Contains an array of message updates by the contractor with timestamp.
    *   createTimeStamp: string. Project creation timestamp.
    *   deadline: string.Project deadline timestamp.
    *   brochurePath: string. Project brochure file path on the server.
    *   type: string. Project type.



---


**PATH**: /contractors/users/{contractor username}

**METHOD**: POST

**BODY**: empty

**USAGE**: Get the contractor profile.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains query message.
*   Object: JSON object. Contains contractor profile which contains the following fields:
    *   username: string. Unique contractor username.
    *   password: string. Contractor password.
    *   email: string.Contractor email id.
    *   contact: string.Contractor contact number.
    *   address: string.Contractor address.
    *   aboutUs: string. Contains a short description of the contractor.
    *   profilePic: string. Path of the contractor profile picture stored in the server.
    *   mid: string. Paytm Merchant ID of the contractor.
    *   mkey: string. Paytm Merchant Key of the contractor.



---


**PATH**: /contractors/bids/applyForProject

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
  <tr>
   <td>projectID
   </td>
   <td>string. Project ID of the project to which bid is applied.
   </td>
  </tr>
  <tr>
   <td>bidDetails
   </td>
   <td>JSON object: Contains bid details with fields like price, completion time etc.
   </td>
  </tr>
</table>


**USAGE**: To apply a bid for a particular project.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains query message.
*   bidID: string. Applied Bid ID.



---


**PATH**: /contractors/project/

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
</table>


**USAGE**: Get current allocated project for a contractor

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. Only returned if the query failed. Value is always false.
*   message: string. Only returned if the query failed. Contains the error message.

    The project object is returned if the query is successful. It contains the following fields:

*   username: string. Username of GAIL client who created the project.
*   id: string. Project ID.
*   title: string. Project Title.
*   description: string. Project description.
*   status: string.Current project status.
*   contractor_id: string. Username of the contractor to whom the project is allocated.
*   bid_id: string. Winning Bid ID of the project
*   progress: JSON array. Contains an array of message updates by the contractor with timestamp.
*   createTimeStamp: string. Project creation timestamp.
*   deadline: string. Project deadline timestamp.
*   brochurePath: string. Project brochure file path on the server.
*   type: string. Project type.



---


**PATH**: /contractors/project/updateProjectStatus

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
  <tr>
   <td>status
   </td>
   <td>string. New Project Status.
   </td>
  </tr>
</table>


**USAGE**: Update status of an allocated project by a contractor

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains query message.



---


**PATH**: /contractors/project/updateProjectProgress

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique contractor username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. Contractor password.
   </td>
  </tr>
  <tr>
   <td>status
   </td>
   <td>string. New Project progress description
   </td>
  </tr>
</table>


**USAGE**: Add a progress description to an allocated project by a contractor

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains query message.



---



# GAIL Services

API services under this group cater to the use-cases from GAIL’s perspective.



---


**PATH**: /gail/admin/signup

**METHOD****: POST

**BODY**: empty

**USAGE**: To register an admin for GAIL users. Needed for the blockchain network wallet for GAIL.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. True if successfully created admin.Otherwise false.



---


**PATH**: /gail/users/signup

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>email
   </td>
   <td>string. User email id.
   </td>
  </tr>
  <tr>
   <td>contact
   </td>
   <td>string, User contact number.
   </td>
  </tr>
  <tr>
   <td>address
   </td>
   <td>string. User address.
   </td>
  </tr>
  <tr>
   <td>designation
   </td>
   <td>string. User designation.
   </td>
  </tr>
  <tr>
   <td>profilePic
   </td>
   <td>string. Path of the user profile picture stored in the server.
   </td>
  </tr>
  <tr>
   <td>name
   </td>
   <td>string. User Name
   </td>
  </tr>
  <tr>
   <td>teamname
   </td>
   <td>string. User Team Name.
   </td>
  </tr>
</table>


**USAGE**: To register a new GAIL user.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean. True if successfully created admin.Otherwise false.
*   username: string. Only returned if the user is successfully created. Contains the username of the new user.
*   message: string. Only returned if the user is not created. Contains the error message.



---


**PATH**: /gail/users/login

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
</table>


**USAGE**: To authenticate a GAIL client

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful authentication.Otherwise false.
*   message: string. Contains query message.



---


**PATH**: /gail/users/getUserDetails

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
</table>


**USAGE**: To get GAIL user profile

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned if the query failed. Contains the error message.
*   Object: JSON object. Only returned if query successful. Contains GAIL client profile which contains the following fields:
    *   username: string. Unique GAIL client username.
    *   password: string. User password.
    *   email: string. User email id.
    *   contact: string, User contact number.
    *   address: string. User address.
    *   designation: string. User designation.
    *   profilePic: string. Path of the user profile picture stored in the server.
    *   name: string. User Name
    *   teamname: string. User Team Name.



---


**PATH**: /gail/users/editUserDetails

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>email
   </td>
   <td>string. User email id.
   </td>
  </tr>
  <tr>
   <td>contact
   </td>
   <td>string, User contact number.
   </td>
  </tr>
  <tr>
   <td>address
   </td>
   <td>string. User address.
   </td>
  </tr>
  <tr>
   <td>designation
   </td>
   <td>string. User designation.
   </td>
  </tr>
  <tr>
   <td>profilePic
   </td>
   <td>string. Path of the user profile picture stored in the server.
   </td>
  </tr>
  <tr>
   <td>name
   </td>
   <td>string. User Name
   </td>
  </tr>
  <tr>
   <td>teamname
   </td>
   <td>string. User Team Name.
   </td>
  </tr>
</table>


**USAGE**: To update GAIL user profile

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned if the query failed. Contains the error message.



---


**PATH**: /gail/project/createProject

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
  <tr>
   <td>title
   </td>
   <td>string. Project Title.
   </td>
  </tr>
  <tr>
   <td>description
   </td>
   <td>string. Project description.
   </td>
  </tr>
  <tr>
   <td>createTimeStamp
   </td>
   <td>string. Project creation timestamp.
   </td>
  </tr>
  <tr>
   <td>deadline
   </td>
   <td>string.Project deadline timestamp.
   </td>
  </tr>
  <tr>
   <td>brochurePath
   </td>
   <td>string. Project brochure file path on the server.
   </td>
  </tr>
  <tr>
   <td>type
   </td>
   <td>string. Project type. (Product/Service)
   </td>
  </tr>
</table>


**USAGE**:To create a new project.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains the query message.

**PATH**: /gail/project/getProject

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
</table>


**USAGE**: To get project details.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains the query message.
*   Object: JSON object. Contains project object which contains the following fields:
    *   username: string. Username of GAIL client who created the project.
    *   id: string. Project ID.
    *   title: string. Project Title.
    *   description: string. Project description.
    *   status: string.Current project status.
    *   contractor_id: string. Username of the contractor to whom the project is allocated.
    *   bid_id: string. Winning Bid ID of the project
    *   progress: JSON array. Contains an array of message updates by the contractor with timestamp.
    *   createTimeStamp: string. Project creation timestamp.
    *   deadline: string.Project deadline timestamp.
    *   brochurePath: string. Project brochure file path on the server.
    *   type: string. Project type.



---


**PATH**: /gail/project/getAllProjects

**METHOD**: POST

**BODY**: empty

**USAGE**: To get all the project details.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned on failure. Contains the error message.
*   Object: JSON object. Contains a dictionary of all projects with project id and project object map. Project object contains the following fields:
    *   username: string. Username of GAIL client who created the project.
    *   id: string. Project ID.
    *   title: string. Project Title.
    *   description: string. Project description.
    *   status: string.Current project status.
    *   contractor_id :string. Username of the contractor to whom the project is allocated.
    *   bid_id :string. Winning Bid ID of the project
    *   progress: JSON array. Contains an array of message updates by a contractor with timestamp.
    *   createTimeStamp : string. Project creation timestamp.
    *   deadline: string. Project deadline timestamp.
    *   brochurePath :string. Project brochure file path on the server.
    *   type: string. Project type.



---


**PATH**: /gail/project/acceptProject

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
</table>


**USAGE**:To accept project work.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains the query message.



---


**PATH**: /gail/project/rejectProject

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
</table>


**USAGE**: To reject project work.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains the query message.



---


**PATH**: /gail/project/getAllBids

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
</table>


**USAGE**: To get all bids for a particular project.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query. Otherwise false.
*   message: string. Only returned on failure. Contains the error message.
*   All bids: JSON array. An array of Bid objects which contains bid details with fields like price, completion time etc



---


**PATH**: /gail/bideval/

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>id
   </td>
   <td>string. Project ID.
   </td>
  </tr>
</table>


**USAGE**: To get the winning bid for a particular project and allocate that bid to that project.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Contains query message.



---


**PATH**: /gail/bideval/getSingleBid

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>username
   </td>
   <td>string. Unique GAIL client username.
   </td>
  </tr>
  <tr>
   <td>password
   </td>
   <td>string. User password.
   </td>
  </tr>
  <tr>
   <td>bid_id
   </td>
   <td>string. Bid ID.
   </td>
  </tr>
</table>


**USAGE**: To get bid details of a particular bid id.

**RESPONSE**: JSON

Contains following fields:



*   success: boolean.True if successful query.Otherwise false.
*   message: string. Only returned on failure. Contains error message.
*   Object: JSON object.Only returned on success. Contains bid object which contains bid details with fields like price, completion time etc.



---



# Payment Services

API services under this group cater to the use-case for payments. Currently, we are supporting Paytm as a payment gateway.



---


**PATH**: /payment/initiateTransaction

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>mid
   </td>
   <td>string. Paytm Merchant ID of the contractor.
   </td>
  </tr>
  <tr>
   <td>merchantKey
   </td>
   <td>string. Paytm Merchant key of the contractor.
   </td>
  </tr>
  <tr>
   <td>orderID
   </td>
   <td>string. Unique transaction order ID.
   </td>
  </tr>
  <tr>
   <td>value
   </td>
   <td>string. Amount of transaction in INR. Can have up to two decimal places.
   </td>
  </tr>
</table>


**USAGE**: Initiate transaction on Paytm Payment Gateway and get a Transaction token.

**RESPONSE**: Returns Paytm Initiate Transaction API response. Details at [https://developer.paytm.com/docs/initiate-transaction-api/#response__attributes](https://developer.paytm.com/docs/initiate-transaction-api/#response__attributes)



---


**PATH**: /payment/validateTransaction

**METHOD**: POST

**BODY**: JSON

Contains following fields:


<table>
  <tr>
   <td>mid
   </td>
   <td>string. Paytm Merchant ID of the contractor.
   </td>
  </tr>
  <tr>
   <td>merchantKey
   </td>
   <td>string. Paytm Merchant key of the contractor.
   </td>
  </tr>
  <tr>
   <td>orderID
   </td>
   <td>string. Unique transaction order ID.
   </td>
  </tr>
</table>


**USAGE**: Get status of a previous transaction based on order ID.

**RESPONSE**: Returns Paytm Transaction Status  API response. Details at [https://developer.paytm.com/docs/transaction-status-api/#response__attributes](https://developer.paytm.com/docs/transaction-status-api/#response__attributes)


