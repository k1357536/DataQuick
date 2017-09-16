import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';

let credentials = require('../dbCredentials.json');

import { Client, QueryResult } from 'pg';

let app = express();
app.use(morgan('dev'));

let client = new Client(credentials);
client.connect().catch(e => {
  console.log(e);
});

app.use('/shared/', express.static(path.join(__dirname, '../shared/')));
app.use('/node_modules/', express.static('./node_modules'));
app.use('/', express.static(path.join(__dirname, '../client/')));

app.get('/api', (req, res, next) => {
  client.query("SELECT 'Hello world'").then(r => {
    res.write(r.rows[0]);
    res.end();
  }).catch(e => {
    res.write(e);
    res.end();
  });
})

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000);
