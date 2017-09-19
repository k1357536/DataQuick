import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';

let credentials = require('../dbCredentials.json');

import { Client, QueryResult } from 'pg';
import * as  metadataApi from './api/metadata.api';

let app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());


let client = new Client(credentials);
client.connect().catch(e => {
  console.log(e);
});

app.use('/shared/', express.static(path.join(__dirname, '../shared/')));
app.use('/node_modules/', express.static('./node_modules'));
app.use('/', express.static(path.join(__dirname, '../client/')));

app.use('/api/metadata', metadataApi);

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
  if (req.accepts().find(m => m == 'text/html')) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  } else
    res.send(404);
});

app.listen(3000);
