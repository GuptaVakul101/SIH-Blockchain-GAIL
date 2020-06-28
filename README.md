# SIH'20 Blockchain GAIL

* **fabric** contains code for the Hyperledger Fabric blockchain network and chaincode (smart contracts).
* **nodeserver** contains the NodeJS and Express backend server code.

---

### Running the test network

```shell
# Deploy the blockchain network
fabric/test-network/network.sh up

# Create sample channel between the peer nodes
fabric/test-network/network.sh createChannel -c channelName

# Deploy chaincode to the channel created
fabric/test-network/network.sh deployCC -l javascript -c channelName

# Remove the blockchain network
fabric/test-network/network.sh down
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

### Running NodeJS GAIL Client server

```shell
# Install all the required dependencies
npm install

# Start the node server
node app.js

# Open localhost:3600 in web browser
```
