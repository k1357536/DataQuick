import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';

let app = express();

app.use(morgan('dev'));

app.use('/shared/', express.static(path.join(__dirname, '../shared/')));
app.use('/node_modules/', express.static('./node_modules'));
app.use('/', express.static(path.join(__dirname, '../client/')));

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(3000);
