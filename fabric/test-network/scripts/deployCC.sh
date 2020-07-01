
CHANNEL_NAME="$1"
VERSION="$2"
DELAY="$3"
MAX_RETRY="$4"
VERBOSE="$5"
ORG1="$6"
ORG1_PEER_INDEX="$7"
ORG2="$8"
ORG2_PEER_INDEX="$9"
: ${CC_SRC_LANGUAGE:="javascript"}
: ${VERSION:="1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

FABRIC_CFG_PATH=$PWD/../config/
CC_RUNTIME_LANGUAGE=node # chaincode runtime language is node.js
CC_SRC_PATH=""
if [[ "$CHANNEL_NAME" == "channelgg" ]]; then
	CC_SRC_PATH="../chaincode/fabcar/javascript/"
else
	CC_SRC_PATH="../chaincode/fabcar/javascript/"
fi

# import utils
. scripts/envVar.sh

packageChaincode() {
  setGlobals $1 $2
  set -x
  peer lifecycle chaincode package fabcar.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label fabcar_${VERSION} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode packaging on peer${2}.${1} has failed"
  echo "===================== Chaincode is packaged on peer${2}.${1} ===================== "
  echo
}

# installChaincode PEER ORG
installChaincode() {
  setGlobals $1 $2
  set -x
  peer lifecycle chaincode install fabcar.tar.gz >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer${2}.${1} has failed"
  echo "===================== Chaincode is installed on peer${2}.${1} ===================== "
  echo
}

# queryInstalled PEER ORG
queryInstalled() {
  ORG=$1
  setGlobals $ORG $2
  set -x
  peer lifecycle chaincode queryinstalled >&log.txt
  res=$?
  set +x
  cat log.txt
	PACKAGE_ID=$(sed -n "/fabcar_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
  verifyResult $res "Query installed on peer${2}.${ORG} has failed"
  echo "===================== Query installed successful on peer${2}.${ORG} on channel ===================== "
  echo
}

# approveForMyOrg VERSION PEER ORG
approveForMyOrg() {
  ORG=$1
  setGlobals $ORG $2
  set -x
  peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name fabcar --version ${VERSION} --init-required --package-id ${PACKAGE_ID} --sequence ${VERSION} >&log.txt
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition approved on peer${2}.${ORG} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition approved on peer${2}.${ORG} on channel '$CHANNEL_NAME' ===================== "
  echo
}

# checkCommitReadiness VERSION PEER ORG
checkCommitReadiness() {
  ORG=$1
  INDEX=$2
  shift 2
  setGlobals $ORG $INDEX
  echo "===================== Checking the commit readiness of the chaincode definition on peer${INDEX}.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to check the commit readiness of the chaincode definition on peer${INDEX}.${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME --name fabcar --version ${VERSION} --sequence ${VERSION} --output json --init-required >&log.txt
    res=$?
    set +x
    let rc=0
    for var in "$@"
    do
      grep "$var" log.txt &>/dev/null || let rc=1
    done
		COUNTER=$(expr $COUNTER + 1)
	done
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Checking the commit readiness of the chaincode definition successful on peer${INDEX}.${ORG} on channel '$CHANNEL_NAME' ===================== "
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Check commit readiness result on peer${INDEX}.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

# commitChaincodeDefinition VERSION PEER ORG (PEER ORG)...
commitChaincodeDefinition() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name fabcar $PEER_CONN_PARMS --version ${VERSION} --sequence ${VERSION} --init-required >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode definition commit failed on peer${2}.${1} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode definition committed on channel '$CHANNEL_NAME' ===================== "
  echo
}

# queryCommitted ORG
queryCommitted() {
  ORG=$1
  setGlobals $ORG $2
  EXPECTED_RESULT="Version: ${VERSION}, Sequence: ${VERSION}, Endorsement Plugin: escc, Validation Plugin: vscc"
  echo "===================== Querying chaincode definition on peer${2}.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query committed status on peer${2}.${ORG}, Retry after $DELAY seconds."
    set -x
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name fabcar >&log.txt
    res=$?
    set +x
		test $res -eq 0 && VALUE=$(cat log.txt | grep -o '^Version: [0-9], Sequence: [0-9], Endorsement Plugin: escc, Validation Plugin: vscc')
    test "$VALUE" = "$EXPECTED_RESULT" && let rc=0
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query chaincode definition successful on peer${2}.${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query chaincode definition result on peer${2}.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

chaincodeInvokeInit() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and org parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  set -x
  peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C $CHANNEL_NAME -n fabcar $PEER_CONN_PARMS --isInit -c '{"function":"initLedger","Args":[]}' >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeQuery() {
  ORG=$1
  setGlobals $ORG $2
  echo "===================== Querying on peer${2}.${ORG} on channel '$CHANNEL_NAME'... ===================== "
	local rc=1
	local COUNTER=1
	# continue to poll
  # we either get a successful response, or reach MAX RETRY
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    echo "Attempting to Query peer${2}.${ORG}, Retry after $DELAY seconds."
    set -x
    peer chaincode query -C $CHANNEL_NAME -n fabcar -c '{"Args":["queryAllCars"]}' >&log.txt
    res=$?
    set +x
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
  echo
  cat log.txt
  if test $rc -eq 0; then
    echo "===================== Query successful on peer${2}.${ORG} on channel '$CHANNEL_NAME' ===================== "
		echo
  else
    echo "!!!!!!!!!!!!!!! After $MAX_RETRY attempts, Query result on peer${2}.${ORG} is INVALID !!!!!!!!!!!!!!!!"
    echo
    exit 1
  fi
}

## at first we package the chaincode
packageChaincode $ORG1 $ORG1_PEER_INDEX

## Install chaincode on peer0.gail and peer0.contractors
echo "Installing chaincode on peer${ORG1_PEER_INDEX}.${ORG1}..."
installChaincode $ORG1 $ORG1_PEER_INDEX
echo "Install chaincode on peer${ORG2_PEER_INDEX}.${ORG2}..."
installChaincode $ORG2 $ORG2_PEER_INDEX

## query whether the chaincode is installed
queryInstalled $ORG1 $ORG1_PEER_INDEX

## approve the definition for gail
approveForMyOrg $ORG1 $ORG1_PEER_INDEX

## check whether the chaincode definition is ready to be committed
## expect gail to have approved and contractors not to
checkCommitReadiness $ORG1 $ORG1_PEER_INDEX "\"GailMSP\": true" "\"ContractorsMSP\": false"
checkCommitReadiness $ORG2 $ORG2_PEER_INDEX "\"GailMSP\": true" "\"ContractorsMSP\": false"

## now approve also for contractors
approveForMyOrg $ORG2 $ORG2_PEER_INDEX

## check whether the chaincode definition is ready to be committed
## expect them both to have approved
checkCommitReadiness $ORG1 $ORG1_PEER_INDEX "\"GailMSP\": true" "\"ContractorsMSP\": true"
checkCommitReadiness $ORG2 $ORG2_PEER_INDEX "\"GailMSP\": true" "\"ContractorsMSP\": true"

## now that we know for sure both orgs have approved, commit the definition
commitChaincodeDefinition $ORG1 $ORG1_PEER_INDEX $ORG2 $ORG2_PEER_INDEX

## query on both orgs to see that the definition committed successfully
queryCommitted $ORG1 $ORG1_PEER_INDEX
queryCommitted $ORG2 $ORG2_PEER_INDEX

## Invoke the chaincode
chaincodeInvokeInit $ORG1 $ORG1_PEER_INDEX $ORG2 $ORG2_PEER_INDEX

sleep 10

# Query chaincode on peer0.gail
echo "Querying chaincode on peer${ORG1_PEER_INDEX}.${ORG1}..."
chaincodeQuery $ORG1 $ORG1_PEER_INDEX

exit 0
