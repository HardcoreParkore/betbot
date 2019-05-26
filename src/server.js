import express from 'express';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import Bet from './model/Bet';

const port = process.env.PORT || 1338;
const hookUrl = process.env.SLACK_HOOK_URL;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/test';
//const mongoDbName = process.env.MONGODB_NAME || 'betbot';

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // omg not having this wasted hours
app.use(bodyParser.json());

mongoose.connect(mongoUri);
mongoose.Promise = global.Promise; // Weird
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('connection open!!');
});
const AutoIncrement = require('mongoose-sequence')(mongoose);
Bet.plugin(AutoIncrement, { inc_field: 'id' });

app.post('/bet', (req, res) => {
  console.info('the request body', req.body);

  // generate the latest id

  Bet.create(
    {
      details: req.body.text
    },
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send('Something went wrong submitting the bet', err, data);
      } else {
        res.status(200).send('Successfully created the bet!');
      }
    }
  );
});

app.post('/bets', (req, res) => {
  Bet.find({}, (err, bets) => {
    let data = [];
    bets.forEach(bet => {
      if (bet.details) {
        data.push(bet.details);
      }
    });
    res.status(200).send(data);
  });
});

app.post('/betkill', (req, res) => {
  console.info(req);
  res.send('complete/finish a bet');
});

app.get('/isalive', (req, res) => {
  res.send(true);
});

app.listen(port, () => {
  console.log('App listening on port ' + port + '.');
});
