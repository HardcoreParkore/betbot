import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();

const port = 1338;

app.post('/bet', (req, res) => {
    res.send('hello parker');
});

app.listen(port, () => {
    console.log('App listening on port ' + port + '.');
});
