import * as express from 'express';

import { RequestHandler } from 'express';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

import { MetadataDriver } from '../drivers/metadata.driver'

let metadata = express.Router();
let driver = new MetadataDriver();

metadata.get('/', (req, res) => {
  try {
    res.json(driver.getAll());
  } catch (e) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
  }
});

metadata.get('/:id', (req, res) => {
  try {
    res.json(driver.get(req.params.id));
  } catch (e) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
  }
});

metadata.post('/', (req, res) => {
  try {
    driver.add(req.body as TableProposal);
    res.sendStatus(200);
  } catch (e) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
  }
});

metadata.put('/:id', (req, res) => {
  let table = Table.sanitize(req.body as Table);
  if (!table || table.id != req.params.id)
    res.sendStatus(400);

  try {
    driver.update(table);
    res.sendStatus(200);
  } catch (e) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
  }
});

metadata.delete('/:id', (req, res) => {
  try {
    driver.delete(req.params.id);
    res.sendStatus(200);
  } catch (e) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
  }
});

export = metadata;
