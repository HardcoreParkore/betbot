import express from 'express';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import Bet from './model/Bet';
import Rule from './model/Rule';

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

/*
  /bet { token: 'token',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   team_id: 'T7LFGPV08',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   team_domain: '10-guys-1-cup',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   channel_id: 'D7N213P1C',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   channel_name: 'directmessage',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   user_id: 'U7M6ZTLRJ',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   user_name: 'enragedboar',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   command: '/bet',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   text: 'test bet',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   response_url:
  Dec 15 17:14:38 betbot-10guys1cup app[web] info    'url',
  Dec 15 17:14:38 betbot-10guys1cup app[web] info   trigger_id: 'id' }
*/

app.post('/bet', (req, res) => {
  console.info('/bet', req.body);

  Bet.create(
    {
      details: req.body.user_name + ': ' + req.body.text,
      metadata: req.body,
      senderUserName: req.body.user_name,
      senderUserId: req.body.user_id
    },
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send('Something went wrong submitting the bet', err, data);
      } else {
        let response = {
          response_type: 'in_channel',
          text: 'BET PLACED: ' + req.body.text
        };
        res.status(200).send(response);
      }
    }
  );
});

app.post('/bets', (req, res) => {
  console.info('/bets', req.body);
  Bet.find({ status: 'ACTIVE' }, (err, bets) => {
    let attachments = [];
    bets.forEach(bet => {
      if (bet.details) {
        let betDetails = '[' + bet.id + '](' + bet.status + '): ' + bet.details;
        attachments.push({ text: betDetails });
      }
    });
    let response = {
      text: "Here's every ACTIVE bet",
      response_type: 'in_channel',
      attachments: attachments
    };
    res.status(200).send(response);
  });
});

app.post('/betkill', (req, res) => {
  console.info('/betkill', req.body);
  // TODO Add the text of the bet that was created

  let id = parseInt(req.body.text);

  let response = {
    response_type: 'in_channel',
    text: 'Bet ' + id + ' has been set to complete by ' + req.body.user_name,
    attachments: req.body.text
  };

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
  res.status(200).send(response);
});

app.post('/rulepropose', (req, res) => {
  console.info('/rulepropose', req.body);

  Rule.create(
    {
      details: req.body.text,
      metadata: req.body,
      senderUserName: req.body.user_name,
      senderUserId: req.body.user_id
    },
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send('Something went wrong submitting the rule', err, data);
      } else {
        let response = {
          response_type: 'in_channel',
          text: 'A rule has been created'
        };
        res.status(200).send(response);
      }
    }
  );
});

app.post('/rules', (req, res) => {
  console.info('/rules', req.body);
  Rule.find({}, (err, rules) => {
    let attachments = [];
    rules.forEach(rule => {
      if (rule.details) {
        let ruleDetails = rule.senderUserName + ': ' + rule.details;
        attachments.push({ text: ruleDetails });
      }
    });
    let response = {
      text: 'All proposed rule changes:',
      response_type: 'in_channel',
      attachments: attachments
    };
    res.status(200).send(response);
  });
});

app.post('/test', (req, res) => {
  console.info('/test', req.body);

  res.send('success');
});

app.get('/isalive', (req, res) => {
  console.info('/isalive', req.body);
  res.send(true);
});

app.listen(port, () => {
  console.log('App listening on port ' + port + '.');
});
