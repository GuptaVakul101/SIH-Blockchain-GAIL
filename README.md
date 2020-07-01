# SIH'20 Blockchain GAIL

* **fabric** contains code for the Hyperledger Fabric blockchain network and chaincode (smart contracts).
* **nodeserver** contains the NodeJS and Express backend server code.
* **GAIL_client** contains the GAIL client website code.

---

### Running the test network

> If you see this message: `WARNING: Connection pool is full, discarding connection: localhost`. That's because the python library `requests` maintains a pool of HTTP connections that the docker library uses. If we use docker-compose with more than 10 containers, this warning will occur. Solution is to change the `DEFAULT_POOLSIZE` of requests library in `~/.local/lib/python*.*/site-packages/requests/adapters.py` to `1000`.

```shell
# Install the required dependencies
./install.sh

# Deploy the blockchain network
fabric/test-network/network.sh up

# Create all required channels between the peer nodes (between every pair of gail and contractor and other among all gail nodes)
fabric/test-network/network.sh createChannel

# Deploy chaincode to the channel created
fabric/test-network/network.sh deployCC

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

---

### Running NodeJS GAIL Client server

```shell
# Install all the required dependencies
npm install

# Start the node server
node app.js

# Open localhost:3600 in web browser
```
