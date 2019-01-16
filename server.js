var express = require("express");
var bodyParser = require("body-parser");
var app = express();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// POST /login gets urlencoded bodies
app.post("/", urlencodedParser, function(req, res) {
  var o = {}; // empty Object
  var Rkey = "responce";
  o[Rkey] = [];

  var buf = JSON.parse(JSON.stringify(req.body));

  var keysArray = Object.keys(buf.payload); // It will return array of indexes
  // looping for
  for (var i = 0; i < keysArray.length; i++) {
    var key = keysArray[i];
    var value = buf.payload[key]; // return single object according to index
    if (value.count > 0) {
      var LogoArray = Object.keys(value.logos);
      var thumbnail = "";
      // looping for inner array 'logos'
      for (var j = 0; j < LogoArray.length; j++) {
        var lkey = LogoArray[j];
        var lvalue = value.logos[lkey];
        var L = parseInt(lvalue.size.split("x")[0]);
        if (L >= 64 || L <= 128) {
          thumbnail = lvalue.url;
        }
      }
      // creating a data object with required properties
      var data = {
        name: value.name,
        count: value.count,
        thumbnail: thumbnail
      };
      if (!Array.isArray(o[Rkey])) {
        o[Rkey] = [];
      }
      o[Rkey].push(data); // data pushing to array then we will convert to JSON
    }
  }
  res.send(o);
});

var server = app.listen(process.env.PORT || 8081, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
  // Now try to access defined API using URL: http://127.0.0.1:8081 or http://localhost:8081
});
