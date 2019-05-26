import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

const port = process.env.PORT || 1338;

app.post('/bet', (req, res) => {
    res.send('hello parker');
});

app.get('/isalive', (req, res) => {
    res.send(true);
});

app.listen(port, () => {
    console.log('App listening on port ' + port + '.');
});
