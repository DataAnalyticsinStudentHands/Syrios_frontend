const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/coin-schema')
const app = express(); 
const cors = require('cors');

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://rahulrajmogili:test123@syrios-cluster.5kobt.mongodb.net/testdb?retryWrites=true&w=majority')

mongoose.connection.once('open', () => {
    console.log('conneted to database');
});
   
//This route will be used as an endpoint to interact with Graphql, 
//All queries will go through this route. 

app.use(cors());
 
app.use('/graphql', graphqlHTTP({
    //Directing express-graphql to use this schema to map out the graph 
    schema,
    //Directing express-graphql to use graphiql     when goto '/graphql' address in the browser
    //which provides an interface to make GraphQl queries
    graphiql:true
}));

app.listen(3002, () => {
    console.log('Listening on port 3002');
}); 