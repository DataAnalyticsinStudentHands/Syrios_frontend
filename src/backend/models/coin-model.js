const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
    obverseFile: String,
    reverseFile: String
});

module.exports = mongoose.model('Author', authorSchema);