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

app.post('/bet', (req, res) => {
  console.info('the request body', req.body);

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
    let attachments = [];
    bets.forEach(bet => {
      if (bet.details) {
        let betDetails = bet.id + ': ' + bet.details + '. ' + bet.status;
        attachments.push({ text: betDetails });
      }
    });
    let response = {
      text: "Here's every bet",
      attachments: attachments
    };
    res.status(200).send(response);
  });
});

app.post('/betkill', (req, res) => {
  let id = parseInt(req.body.text);
  if (!isNaN(parseInt(id))) {
    Bet.updateOne(
      { id: id },
      {
        $set: {
          status: 'COMPLETE'
        }
      },
      (err, bet) => {
        if (err) {
          res.status(500).send("I don't think that's a valid ID", err);
        }
      }
    );
  } else {
    res
      .status(500)
      .send(
        'Input not a number. Please specify JUST the ID you want to cancel'
      );
  }
  res.send('Bet completed');
});

app.get('/isalive', (req, res) => {
  res.send(true);
});

app.listen(port, () => {
  console.log('App listening on port ' + port + '.');
});
