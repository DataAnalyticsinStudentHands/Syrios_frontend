var mongodb = require("mongodb");
const { doc } = require("prettier");

var client = mongodb.MongoClient;
var url = "mongodb://localhost/testaroo";

var coins = [];

client.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(err, client) {
    var db = client.db("Syrios");
    var collection = db.collection("AntiochCoins");

    var query = {};
    var projection = {
      obverseFile: "$obverseFile",
      _id: 0,
    };

    var cursor = collection.find(query).project(projection);

    cursor.forEach(
      function(doc) {
          console.log(doc);     // comment this
        // coins.push(doc);     // uncomment this
      },
      function(err) {
        // console.log(coins);      // uncomment this - follow the upper 3 comments to get list of coin images. But redundant.
        client.close();
      }
    );
  }
);
