import express from 'express'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import assert from 'assert'

const port = process.env.PORT || 1338
const hookUrl = process.env.SLACK_HOOK_URL
const mongoUri = process.env.MONGODB_URI
const mongoDbName = process.env.MONGODB_NAME

const app = express()

let Schema = mongoose.Schema

import Bet from './model/Bet'

mongoose.connect(mongoUri)
mongoose.Promise = global.Promise // Weird

let db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function() {
  console.log('connection open!!')
})

app.post('/bet', (req, res) => {
  console.info(req.body)

  Bet.insertOne(
    {
      details: req.body
    },
    (err, data) => {
      if (err) {
        res
          .status(500)
          .send('Something went wrong submitting the bet', err, data)
      } else {
        res.status(200).send('Successfully created the bet!')
      }
    }
  )
})

app.post('/bets', (req, res) => {
  Bet.find({}, (err, bets) => {
    let data = []
    bets.forEach(bet => {
      data.push({ betDetails: bet.details })
    })
    res.status(200).send(data)
  })
})

app.post('/betkill', (req, res) => {
  console.info(req)
  res.send('complete/finish a bet')
})

app.get('/isalive', (req, res) => {
  res.send(true)
})

app.listen(port, () => {
  console.log('App listening on port ' + port + '.')
})
