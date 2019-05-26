import express from 'express';
import path from 'path';
import fs from 'fs';
import mongodb from 'mongodb';
import assert from 'assert';

const app = express();

const port = process.env.PORT || 1338;
const hookUrl = process.env.SLACK_HOOK_URL;
const mongoUri = process.env.MONGODB_URI;
const mongoDbName = process.env.MONGODB_NAME;
const MongoClient = mongodb.MongoClient;

let db = null;

MongoClient.connect(mongoUri, (err, client) => {
    assert.equal(null, err);
    db = client.db(mongoDbName);
});

app.post('/bet', (req, res) => {
    console.info(req);

    db.collection('bets').insertOne({
        bet: req.body
    }).then((result) => {
        res.status(200).send('created a bet', req.body);
    });
});

app.post('/bets', (req, res) => {
    console.info(req);
    let cursor = db.collection('bets').find({});
    res.status.send(cursor);
//    res.status(200).send('retrieve all bets');
});

app.post('/betkill', (req, res) => {
    console.info(req);
    res.status(200).send('complete/finish a bet');
});

app.get('/isalive', (req, res) => {
    res.send(true);
});

app.listen(port, () => {
    console.log('App listening on port ' + port + '.');
});
