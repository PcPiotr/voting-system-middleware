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
  if (counter1 % 2 == 0) {
    res.send(new Candidate(753, "Todd", "Howard", 48, "Polska Partia Przyjaciół Piwa", 1, 2));
  } else {
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
  var candidateList = [new Candidate(565, "Daniel", "Gildenlow", 45, "Bestest Party", 1, 3), new Candidate(384, "Steven", "Wilson ", 51, "Partia Testowa", 2, 5), new Candidate(153, "Mariusz", "Duda ", 43, "Xanadu", 3, 4)];
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
