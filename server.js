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

