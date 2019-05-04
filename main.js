var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var counter1 = 0;
var counter2 = 0;


app.get('/getVote', function (req, res) {
   var tokenId = req.body.tokenId;
    counter1++;
    if(tokenId == null) {
        res.status(400).send("No candidate Id");
    }


    if(counter1 % 2 == 0) {
        res.send("Yis");
    } else {
        res.status(400).send("Bad candidate Id");
    }
    res.end();
})

app.post('/vote', function (req, res) {
   
    counter2++;
    if(counter2 % 2 == 0)
        res.send("Yis");
    else
        res.send("Nope");
})

var server = app.listen(8081, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("Example app listening at http://%s:%s", host, port);
})