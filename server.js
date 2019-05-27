var express = require("express");
var cors = require('cors');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
    res.status(400).send({
      Message: "Nonexistent voter"
    });
  }
  
});

app.post("/vm/vote", function (req, res) {
  var tokenId = req.body.tokenId;
  var candidateId = req.body.candidateId;

  if (tokenId == null) {
    res.status(400).send({
        Message: "Nonexistent voter"
      });
  }
  if (candidateId == null) {
    res.status(400).send({
      Message: "Nonexistent candidate"
    });
  }

  counter2++;
  if (counter2 % 2 == 0) {
    res.send({
      Message: "Voting went good"
    });
  } else {
    res.status(400).send({
      Message: "Nonexistent voter"
    });
  }
});

app.get("/vm/getCandidates", function (req, res) {
  var candidateList = [
    new Candidate(565, "Daniel", "Gildenlow", "Bestest Party", 1, 45, 1), 
    new Candidate(561, "Jerzy", "Dudek", "Bestest Party", 1, 42, 2), 
    new Candidate(562, "Kuba", "Jarek", "Bestest Party", 1, 43, 3), 
    new Candidate(384, "Steven", "Wilson","Partia Testowa", 2, 53, 1), 
    new Candidate(382, "Elon", "Musk", "Partia Testowa", 2, 55, 2), 
    new Candidate(381, "Mocked", "Candidate ","Partia Testowa", 2, 52,3), 
    new Candidate(153, "Mariusz", "Duda ", "Xanadu", 3, 41, 1),
    new Candidate(151, "Alan", "Kanala ", "Xanadu", 3, 48, 2),
    new Candidate(157, "Reis", "Martek ", "Xanadu", 3, 44, 3)];
  res.status(400).send(candidateList);
});

app.get("/vm/getResultsByCandidates", function (req, res) {
  var candidateList = [
    new CandidateResult(1,14), 
    new CandidateResult(2,63),
    new CandidateResult(3,24), 
    new CandidateResult(4,154)];
  res.status(400).send(candidateList);
});

app.get("/vm/getResultsByParties", function (req, res) {
  var partiesList = [
    new PartyResult(1,52), 
    new PartyResult(2,126),
    new PartyResult(3,412), 
    new PartyResult(4,1684)];
  res.status(400).send(partiesList);
});

app.post("/vm/beginVoting", function (req, res) {
  res.status(400).send({Message:"OK"});
});

app.post("/vm/endVoting", function (req, res) {
  res.status(400).send({Message:"OK"});
});

/*
app.post("/vm/endVoting", function (req, res) {
  var exampleNetwork = new ExampleNetwork('admin');

  exampleNetwork.init().then(function(data) {
    return trucerts.endVoting()
  }).then(function (data) {
    res.status(200).json({Message: data.status})
  }).catch(function(err) {
    res.status(500).json({error: err.toString()})
  })
});
*/

var server = app.listen(8081, function () {
  var port = server.address().port;
  console.log("App listening at http://localhost:%s", port);
});

class Candidate {
  constructor(candidateId, firstName, lastName, party, listNo, age, noOnList) {
    this.candidateId = candidateId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.party = party;
    this.listNo = listNo;
    this.age = age;
    this.noOnList = noOnList;
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

class CandidateResult {
  constructor(candidateId, votes) {
    this.candidateId = candidateId;
    this.votes = votes;
  }
}

class PartyResult {
  constructor(party, votes) {
    this.party = party;
    this.votes = votes;
  }
}

/* https://www.skcript.com/svr/setting-up-restful-api-server-for-hyperledger-fabric-with-nodejs-sdk/ */