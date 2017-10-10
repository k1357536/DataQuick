import * as express from 'express';
import { Router, Response } from 'express';

import { TableProposal, Table, Column } from '../../shared/metadata.model';
import { Utils } from '../utils';

import { MetadataDriver } from '../drivers/metadata.driver';
import { DataDriver } from '../drivers/data.driver';

export function MetadataApi(): Router {
  const metadata = express.Router();
  const driver = new MetadataDriver();
  const dataDriver = new DataDriver();

  function handleError(e: any, res: Response) {
    console.error(e);
    try {
      if (Number(e) !== NaN)
        res.sendStatus(Number(e));
      else
        res.sendStatus(500);
    } catch{
      res.sendStatus(500);
    }
  }

  metadata.get('/', async (req, res) => {
    try {
      res.json(await driver.getAll());
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.get('/:id', async (req, res) => {
    try {
      res.json(await driver.get(req.params.id));
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.post('/', async (req, res) => {
    try {
      const p: TableProposal = req.body;
      if (!p.name || typeof p.name !== 'string')
        throw 400;

      const newTable = await driver.add(p.name);
      await dataDriver.create(newTable);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.put('/:id', async (req, res) => {
    try {
      const table = Utils.sanitizeTable(req.body);
      if (!table || table.id != req.params.id) {
        console.log("Column JSON: " + JSON.stringify(req.body));
        res.sendStatus(400);
      }

      await driver.update(table);
      await dataDriver.drop(table.id);
      await dataDriver.create(table);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.delete('/:id', async (req, res) => {
    try {
      await driver.delete(req.params.id);
      await dataDriver.drop(req.params.id);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  return metadata;
}
