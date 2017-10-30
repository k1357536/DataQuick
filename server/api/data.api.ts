import * as express from 'express';
import { Router, Response } from 'express';

import { MetadataDriver } from '../drivers/metadata.driver';
import { DataDriver } from '../drivers/data.driver';

export function DataApi(): Router {
  const data = express.Router();
  const driver = new DataDriver();
  const metadataDriver = new MetadataDriver();

  function handleError(e: any, res: Response) {
    console.error(e);
    try {
      if (Number.isInteger(e))
        res.sendStatus(Number(e));
      else
        res.status(500).send(e);
    } catch {
      res.sendStatus(500).send(e);
    }
  }
  data.get('/count/:id', async (req, res) => {
    try {
      res.json(await driver.count(req.params.id));
    }
    catch (e) {
      handleError(e, res);
    }
  });
  data.get('/:id', async (req, res) => {
    try {
      let table = await metadataDriver.get(req.params.id);
      res.json(await driver.getAll(table, req.query.sortby));
    }
    catch (e) {
      handleError(e, res);
    }
  });
  data.get('/:tableId/:entryId', async (req, res) => {
    try {
      res.json(await driver.get(req.params.tableId, req.params.entryId));
    }
    catch (e) {
      handleError(e, res);
    }
  });

  data.put('/:tableId', async (req, res) => {
    try {
      let table = await metadataDriver.get(req.params.tableId);

      const entry = req.body; // TODO Utils.sanitizeEntry(req.body);
      if (!entry) {
        console.log("Entry JSON: " + JSON.stringify(req.body));
        res.sendStatus(400);
      }

      await driver.update(table, entry);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  data.post('/:tableId', async (req, res) => {
    try {
      let table = await metadataDriver.get(req.params.tableId);

      const entry = req.body; // TODO Utils.sanitizeEntry(req.body);
      if (!entry) {
        console.log("Entry JSON: " + JSON.stringify(req.body));
        res.sendStatus(400);
      }

      await driver.insert(table, entry);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  data.delete('/:tableId/:entryId', async (req, res) => {
    try {
      await driver.delete(req.params.tableId, req.params.entryId);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  return data;
}
