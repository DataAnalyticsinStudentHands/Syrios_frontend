const router = require("express").Router();
let Coin = require("./coins.model");

router.route("/").get((req, res) => {
  var cursor = collection.find(query).project(projection);
  cursor.forEach(
    function(doc) {
      console.log(doc);
    },
    function(err) {
      client.close();
    }
  );
  Coin.find()
    .then((coins) => res.json(coins))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
