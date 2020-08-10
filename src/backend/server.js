const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb://localhost/syrios';

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const coinsRouter = require('./routes/coins');

app.use('/coin-pile', coinsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
