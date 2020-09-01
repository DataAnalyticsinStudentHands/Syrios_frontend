const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// database schema
const coinSchema = new Schema({
  _id: String,
  Title: String,
  Bibliography: String,
  ReverseType: String,
  Image: String,
  Region: String,
  Mint: String,
  State: String,
  Date: String,
  FromDate: Number,
  ToDate: Number,
  Material: String,
  Denomination: String,
  ObverseLegend: String,
  ReverseLegend: String,
  SourceImage: String,
  RightsHolder: String,
  ObverseType: String,
  TypeCategory: String,
  IssuingAuthority: String,
  Diameter: Number,
  Era: String,
  obverseFile: String,
  reverseFile: String,
});

// singular name of the collection - Mongoose automatically looks for the plural, lowercased version of our model name.
module.exports = mongoose.model('Antiochcoin', coinSchema);
