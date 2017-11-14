import * as express from 'express';
import { Router, Response } from 'express';

import { MetadataDriver } from '../drivers/metadata.driver';
import { DataDriver } from '../drivers/data.driver';

import { Utils } from '../utils';

export function DataApi(): Router {
  const data = express.Router();
  const driver = new DataDriver();
  const metadataDriver = new MetadataDriver();

  function handleError(e: any, res: Response) {
    console.error(e);
    try {
      if (Number.isInteger(e))
        res.sendStatus(Number(e));
      else if (e.message)
        res.status(500).send(e.message);
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
  data.get('/export/', async (_req, res) => {
    try {
      res.setHeader('Content-type', "application/json");
      res.setHeader('Content-disposition', 'attachment; filename=data.json');

      res.write('[');

      const tables = await metadataDriver.getAll();
      let first = true;
      for (const t of tables) {
        if (!first)
          res.write(',');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = await driver.getAll(t);
        res.write(JSON.stringify({ id: t.id, data }));
        first = false;
      }
      res.write(']');
      res.end();
    }
    catch (e) {
      handleError(e, res);
    }
  });
  data.get('/summaries/:id', async (req, res) => {
    try {
      const table = await metadataDriver.get(req.params.id);
      const sumCol = table.columns.find(c => c.inSummary == true);
      if (!sumCol)
        res.sendStatus(500);
      else
        res.json(await driver.getSummaries(table, sumCol));
    }
    catch (e) {
      handleError(e, res);
    }
    res.json([{ id: -1, label: 'M' }, { id: -2, label: 'N' }]);
  });
  data.get('/:id', async (req, res) => {
    try {
      const table = await metadataDriver.get(req.params.id);
      res.json(await driver.getAll(table, req.query.sortby, req.query.sortASC != 'false', req.query.page, req.query.pageSize));
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
      const table = await metadataDriver.get(req.params.tableId);

      const entry = Utils.sanitizeEntry(table, req.body);
      if (!entry) {
        console.error("Entry JSON: " + JSON.stringify(req.body));
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
      const table = await metadataDriver.get(req.params.tableId);

      const entry = req.body; // TODO Utils.sanitizeEntry(req.body);
      if (!entry) {
        console.error("Entry JSON: " + JSON.stringify(req.body));
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
