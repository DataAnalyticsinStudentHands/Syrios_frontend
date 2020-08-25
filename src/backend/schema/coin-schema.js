const graphql = require("graphql");
// const Book = require("../models/book");
const Coin = require("../models/coin-model");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const CoinType = new GraphQLObjectType({
  name: "Coin",
  fields: () => ({
    id: { type: GraphQLID },
    obverseFile: { type: GraphQLString },
    reverseFile: { type: GraphQLString },
  }),
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    coins: {
      type: new GraphQLList(CoinType),
      resolve(parent, args) {
        return Coin.find({});
      },
    },
  },
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery
});
