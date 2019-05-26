"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _assert = _interopRequireDefault(require("assert"));

var _Bet = _interopRequireDefault(require("./model/Bet"));

var port = process.env.PORT || 1338;
var hookUrl = process.env.SLACK_HOOK_URL;
var mongoUri = process.env.MONGODB_URI;
var mongoDbName = process.env.MONGODB_NAME;
var app = (0, _express["default"])();
var Schema = _mongoose["default"].Schema;

_mongoose["default"].connect(mongoUri);

_mongoose["default"].Promise = global.Promise; // Weird

var db = _mongoose["default"].connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('connection open!!');
});
app.post('/bet', function (req, res) {
  console.info(req.body);

  _Bet["default"].insertOne({
    details: req.body
  }, function (err, data) {
    if (err) {
      res.status(500).send('Something went wrong submitting the bet', err, data);
    } else {
      res.status(200).send('Successfully created the bet!');
    }
  });
});
app.post('/bets', function (req, res) {
  _Bet["default"].find({}, function (err, bets) {
    var data = [];
    bets.forEach(function (bet) {
      data.push({
        betDetails: bet.details
      });
    });
    res.status(200).send(data);
  });
});
app.post('/betkill', function (req, res) {
  console.info(req);
  res.send('complete/finish a bet');
});
app.get('/isalive', function (req, res) {
  res.send(true);
});
app.listen(port, function () {
  console.log('App listening on port ' + port + '.');
});