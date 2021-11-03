const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("./backend/schema/coin-schema");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// setup nodemailer transport - using local sendmail
const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail",
});

// POST route form email sending from download form
app.post("/send", (req, res) => {
  console.log(req.body);
  const mailOptions = {
    from: "Syrios Site Watcher <dashadmin@uh.edu>",
    to: "kmneuma2@central.uh.edu",
    subject: "New entry at Syrios form",
    text: `From: ${req.body.email} \nName: ${req.body.name} \nPhone: ${req.body.phone} \nMessage: ${req.body.writtenMessage}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.json({
        status: "fail",
        error: err,
      });
    } else {
      res.json({
        status: `success ${data}`,
      });
    }
  });
});

// This route will be used as an endpoint to interact with Graphql,
// All queries will go through this route.
app.use(
  "/graphql",
  graphqlHTTP({
    // Directing express-graphql to use this schema to map out the graph
    schema,
    // Directing express-graphql to use graphiql     when goto '/graphql' address in the browser
    // which provides an interface to make GraphQl queries
    graphiql: true,
  })
);

// this part is serving the front-end client 
//const path = require("path");

//app.use(express.static(path.join(__dirname, "client/build")));
//app.get("/*", function(req, res) {
  //res.sendFile(path.join(__dirname, "client/build", "index.html"));
//});

mongoose
  .connect(process.env.MongoDB, {
    useNewUrlParser: true,
  })
  .catch((err) => {
    console.log(err.stack);
    process.exit(1);
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on port ${port}`);
      console.log("connected to database");
    });
  });
