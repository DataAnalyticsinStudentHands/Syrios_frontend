const graphql = require("graphql");
// const Book = require("../models/book");
const Coin = require("../models/coin-model");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
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
    _id: { type: GraphQLID },
    Title: { type: GraphQLString },
    Bibliography: { type: GraphQLString },
    ReverseType: {type: GraphQLString},
    Image: {type: GraphQLString},
    Region: {type: GraphQLString},
    Mint: {type: GraphQLString},
    State: {type: GraphQLString},
    Date: {type: GraphQLString},
    FromDate: {type: GraphQLInt},
    ToDate: {type: GraphQLInt},
    Material: {type: GraphQLString},
    Denomination: {type: GraphQLString},
    ObverseLegend: {type: GraphQLString},
    ReverseLegend: {type: GraphQLString},
    SourceImage: {type: GraphQLString},
    RightsHolder: {type: GraphQLString},
    ObverseType: {type: GraphQLString},
    TypeCategory: {type: GraphQLString},
    IssuingAuthority: {type: GraphQLString},
    Diameter: {type: GraphQLInt},
    Era: {type: GraphQLString},
    Diameter: { type: GraphQLFloat },
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
  query: RootQuery,
});
