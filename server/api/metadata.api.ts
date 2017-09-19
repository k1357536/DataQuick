import * as express from 'express';

import { RequestHandler } from 'express';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

let metadata = express.Router();

let dummy: Table[] = [
  new Table('99ea308a-4fc9-4daa-90ae-6138ca47e62c', 'Employees', [Column.createIdColumn()]),
  new Table('6a29a500-ef83-4eb5-b76a-d580a26613d4', 'Products', [Column.createIdColumn()])
];

metadata.get('/', (req, res) => {
  res.json(dummy);
});

metadata.get('/:id', (req, res) => {
  let table = dummy.find(t => t.id === req.params.id);
  if (!table)
    res.sendStatus(404);
  else
    res.json(table);
});

metadata.post('/', (req, res) => {
  let p = req.body as TableProposal;
  let t = Table.createDefault(p.name);
  dummy.push(t);
  res.json(t);
});

metadata.put('/:id', (req, res) => {
  let table = Table.sanitize(req.body as Table);
  if (!table)
    res.sendStatus(400);
  else if (table.id != req.params.id)
    res.sendStatus(400);
  else {
    let index = dummy.findIndex(t => t.id === table.id);
    if (index == -1)
      res.sendStatus(404);
    else {
      dummy[index] = table;
      res.json(table);
    }
  }
});

metadata.delete('/:id', (req, res) => {
  let index = dummy.findIndex(t => t.id === req.params.id);

  if (index == -1)
    res.sendStatus(404);
  else {
    dummy.splice(index, 1);
    res.sendStatus(200);
  }
});

export = metadata;
