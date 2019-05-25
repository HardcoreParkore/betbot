import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();

app.use(cors());

const port = 1338;

app.post('/bet', (req, res) => {
    res.send('hello parker');
});

app.listen(port, () => {
    console.log('App listening on port ' + port + '.');
});
