var express = require("express");
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


var FabricClient = require('fabric-client');
var fs = require('fs');
var path = require('path');
var configFilePath = path.join(__dirname, './ConnectionProfile.yml');
const CONFIG = fs.readFileSync(configFilePath, 'utf8')
class FBClient extends FabricClient {
    constructor(props) {
        super(props);
    }
    submitTransaction(requestData) {
        var returnData;
        var _this = this;
        var channel = this.getChannel();
        var peers = this.getPeersForOrg();
        var event_hub = this.getEventHub(peers[0].getName());
        return channel.sendTransactionProposal(requestData).then(function (results) {
            var proposalResponses = results[0];
            var proposal = results[1];
            let isProposalGood = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                isProposalGood = true;
                console.log('Transaction proposal was good');
            } else {
                throw new Error(results[0][0].details);
                console.error('Transaction proposal was bad');
            }
            returnData = proposalResponses[0].response.payload.toString();
            returnData = JSON.parse(returnData);
            if (isProposalGood) {
                console.log(
                    'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
                    proposalResponses[0].response.status, proposalResponses[0].response.message);
                var request = {
                    proposalResponses: proposalResponses,
                    proposal: proposal
                };
                var transaction_id_string = requestData.txId.getTransactionID();
                var promises = [];
                var sendPromise = channel.sendTransaction(request);
                promises.push(sendPromise); 
                let txPromise = new Promise((resolve, reject) => {
                    let handle = setTimeout(() => {
                        event_hub.disconnect();
                        resolve({ event_status: 'TIMEOUT' });
                    }, 3000);
                    event_hub.connect();
                    event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
                        clearTimeout(handle);
                        event_hub.unregisterTxEvent(transaction_id_string);
                        event_hub.disconnect();
                        var return_status = { event_status: code, tx_id: transaction_id_string };
                        if (code !== 'VALID') {
                            console.error('The transaction was invalid, code = ' + code);
                            resolve(return_status);
                        } else {
                            console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
                            resolve(return_status);
                        }
                    }, (err) => {
                        console.log(err)
                        reject(new Error('There was a problem with the eventhub ::' + err));
                    });
                });
                promises.push(txPromise);
                return Promise.all(promises);
            } else {
                console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
                throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
            }
        }).then((results) => {
            console.log('Send transaction promise and event listener promise have completed');
            if (results && results[0] && results[0].status === 'SUCCESS') {
                console.log('Successfully sent transaction to the orderer.');
            } else {
                console.error('Failed to order the transaction. Error code: ' + response.status);
            }
            if (results && results[1] && results[1].event_status === 'VALID') {
                console.log('Successfully committed the change to the ledger by the peer');
            } else {
                console.log('Transaction failed to be committed to the ledger due to ::' + results[1].event_status);
            }
        }).then(function () {
            return returnData;
        })
    }
    query(requestData) {
        var channel = this.getChannel();
        return channel.queryByChaincode(requestData).then((response_payloads) => {
            var resultData = JSON.parse(response_payloads.toString('utf8'));
            return resultData;
        }).then(function(resultData) {
            if (resultData.constructor === Array) {
                resultData = resultData.map(function (item, index) {
                    if (item.data) {
                        return item.data
                    } else {
                        return item;
                    }
                })
            }
            return resultData;
        });
    }
}
var fabricClient = new FBClient();
fabricClient.loadFromConfig(configFilePath);
module.exports = fabricClient;


const ExampleNetwork = require('./ExampleNetwork');
app.post('/api/sell/:tokenId"', function(req, res) {
        var data = req.params.tokenId;
        var exampleNetwork = new ExampleNetwork('admin');
        exampleNetwork.init().then(function(data) {
          return exampleNetwork.sell(data)
        }).then(function (data) {
          res.status(200).json(data)
        }).catch(function(err) {
          res.status(500).json({error: err.toString()})
        })
})



var counter1 = 1;
var counter2 = 1;

app.get("/vm/getVote/:tokenId", function (req, res) {
  counter1++;
  if (counter1 % 3 == 0) {
    res.send(new Voter(req.params.tokenId));
  }
  else if (counter1 % 3 == 1) {
    res.send(new Voter(req.params.tokenId, 132442));
  }
  else {
    res.status(400).send("Nonexistent voter");
  }
});

app.post("/vm/vote", function (req, res) {
  var tokenId = req.body.tokenId;
  var candidateId = req.body.candidateId;

  if (tokenId == null) {
    res.status(400).send("Nonexistent voter");
  }
  if (candidateId == null) {
    res.status(400).send("Nonexistent candidate");
  }

  counter2++;
  if (counter2 % 2 == 0) {
    res.send("Voting went good");
  } else {
    res.status(400).send("Nonexistent voter");
  }
});

app.get("/vm/getCandidates", function (req, res) {
  var candidateList = [
    new Candidate(565, "Daniel", "Gildenlow", 45, "Bestest Party", 1, 1), 
    new Candidate(561, "Jerzy", "Dudek", 42, "Bestest Party", 1, 2), 
    new Candidate(562, "Kuba", "Jarek", 41, "Bestest Party", 1, 3), 
    new Candidate(384, "Steven", "Wilson ", 51, "Partia Testowa", 2, 1), 
    new Candidate(382, "Elon", "Musk ", 55, "Partia Testowa", 2, 2), 
    new Candidate(381, "Mocked", "Candidate ", 54, "Partia Testowa", 2, 3), 
    new Candidate(153, "Mariusz", "Duda ", 41, "Xanadu", 3, 1),
    new Candidate(151, "Alan", "Kanala ", 48, "Xanadu", 3, 2),
    new Candidate(157, "Reis", "Martek ", 44, "Xanadu", 3, 3)];
  res.status(400).send(candidateList);
});

var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("App listening at http://localhost:%s", port);
});

class Candidate {
  constructor(id, name, surname, age, party, listNumber, numberOnList) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.age = age;
    this.party = party;
    this.listNumber = listNumber;
    this.numberOnList = numberOnList;
  }
}

class Voter {
  constructor(voterId, candidateId) {
    this.voterId = voterId;
    if (candidateId === undefined) {
      this.candidateId = null;
    }
    else {
      this.candidateId = candidateId;
    }
  }
}

class ExampleNetwork {
  constructor(userName) {
    this.currentUser;
    this.issuer;
    this.userName = userName;
    this.connection = fabricClient;
  }
  init() {
    var isAdmin = false;
    if (this.userName == "admin") {
      isAdmin = true;
    }
    return this.connection.initCredentialStores().then(() => {
      return this.connection.getUserContext(this.userName, true)
    }).then((user) => {
      this.issuer = user;
      if (isAdmin) {
        return user;
      }
      return this.ping();
    }).then((user) => {
      this.currentUser = user;
      return user;
    })
  }
   sell(data) {
    var tx_id = this.connection.newTransactionID();
    var requestData = {
      fcn: 'init',
      args: [data],
      txId: tx_id
    };
    var request = FabricModel.requestBuild(requestData);
    return this.connection.submitTransaction(request);
  }
}

