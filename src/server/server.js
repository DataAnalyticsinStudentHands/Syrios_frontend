const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType,
} = require("graphql");
var app = Express();
var cors = require("cors");
const url = "mongodb://localhost/testaroo";

app.use(cors());

mongoose
  .connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  )
  .then(() => console.log("Connected to database..."))
  .catch((err) => console.error(err));

const CoinModel = mongoose.model("person", {
  obverseFile: String,
  reverseFile: String,
});

const CoinType = new GraphQLObjectType({
  name: "Coin",
  fields: {
    _id: { type: GraphQLID },
    obverseFile: { type: GraphQLString },
    reverseFile: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      coinByObverse: {
        type: CoinType,
        args: {
          obverseFile: { type: GraphQLString },
        },
        resolve: (root, args, context, info) => {
          return CoinModel.find({ obverseFile: args.obverseFile }).exec();
        },
      },
    },
  }),
});

app.use("/coin-info", ExpressGraphQL({ schema, graphiql: true }));

app.listen(3001, () => {
  console.log("server running at 3001");
});



// function(err, client) {
//   var db = client.db("Syrios");
//   var collection = db.collection("AntiochCoins");

//   var query = {};
//   var projection = {
//     obverseFile: "$obverseFile",
//     _id: 0,
//   };
// }