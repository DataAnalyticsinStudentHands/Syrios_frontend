var mongodb = require("mongodb");

var client = mongodb.MongoClient;

var db = client.db("Syrios");
var collection = db.collection("AntiochCoins");

var query = {};
var projection = {
  obverseFile: "$obverseFile",
  _id: 0,
};

if (err) throw err;
