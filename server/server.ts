import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';

import { MetadataApi } from './api/metadata.api';
import { DataApi } from './api/data.api';

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/shared/', express.static(path.join(__dirname, '../shared/')));
app.use('/node_modules/', express.static('./node_modules'));
app.use('/', express.static(path.join(__dirname, '../client/')));

app.use('/api/data', DataApi());
app.use('/api/metadata', MetadataApi());

app.get('*', (req, res, next) => {
  if (req.accepts().find(m => m === 'text/html')) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  } else
    res.send(404);
});

app.listen(3000);
