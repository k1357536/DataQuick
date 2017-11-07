import * as express from 'express';
import { Router, Response } from 'express';

import { TableProposal, FolderProposal, Table, Folder } from '../../shared/metadata.model';
import { UUIDs } from '../../shared/metadata.utils';
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
      if (Number.isInteger(e))
        res.sendStatus(Number(e));
      else
        res.status(500).send(e);
    } catch{
      res.status(500).send(e);
    }
  }

  // === Folders ===============================================================
  metadata.get('/folders/', async (_, res) => {
    try {
      res.json(await driver.getAllFolders());
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.post('/folders/', async (req, res) => {
    try {
      const p: FolderProposal | Folder = req.body;
      if (!p.name || typeof p.name !== 'string' || !p.parent || typeof p.parent !== 'string') {
        console.error(p);
        throw 400;
      }

      await driver.addFolder(p);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.delete('/folders/all', async (req, res) => {
    const sender = req.connection.remoteAddress;
    if (sender !== '127.0.0.1' && sender !== '::1')
      res.sendStatus(403);
    else
      try {
        await driver.deleteAllFolders();
        res.sendStatus(200);
      }
      catch (e) {
        handleError(e, res);
      }
  });

  metadata.delete('/folders/:id', async (req, res) => {
    try {
      await driver.deleteFolder(req.params.id);
      res.sendStatus(200);
    }
    catch (e) {
      handleError(e, res);
    }
  });

  // === Tables ================================================================
  metadata.get('/', async (req, res) => {
    try {
      const parent = UUIDs.check(req.query.parent);
      const dependents = UUIDs.check(req.query.dependents);
      if (parent)
        res.json(await driver.getChildren(parent));
      else if (dependents)
        res.json(await driver.getDependents(dependents));
      else
        res.json(await driver.getAll());
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.get('/:id', async (req, res) => {
    try {
      const id = UUIDs.check(req.params.id);
      if (!id)
        res.sendStatus(400);
      else
        res.json(await driver.get(id));
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.post('/', async (req, res) => {
    try {
      const p: Table | TableProposal = req.body;
      if (!p.name || typeof p.name !== 'string' || !p.parent) {
        console.error(p);
        throw 400;
      }

      const tbls = await driver.search(p);
      if (tbls.length > 0)
        res.sendStatus(409);
      else {
        const newTable = await driver.add(p);
        await dataDriver.create(newTable);
        res.sendStatus(200);
      }
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.put('/:id', async (req, res) => {
    try {
      const id = UUIDs.check(req.params.id);
      if (!id)
        res.sendStatus(400);
      else {
        const table = Utils.sanitizeTable(req.body);
        if (!table || table.id != id) {
          console.error("Column JSON: " + JSON.stringify(req.body));
          res.sendStatus(400);
        } else {
          await driver.update(table);
          await dataDriver.drop(table.id);
          await dataDriver.create(table);
          res.sendStatus(200);
        }
      }
    }
    catch (e) {
      handleError(e, res);
    }
  });

  metadata.delete('/all', async (req, res) => {
    const sender = req.connection.remoteAddress;
    if (sender !== '127.0.0.1' && sender !== '::1')
      res.sendStatus(403);
    else
      try {
        await driver.deleteAll();
        await dataDriver.dropAll();
        res.sendStatus(200);
      }
      catch (e) {
        handleError(e, res);
      }
  });

  metadata.delete('/:id', async (req, res) => {
    try {
      const id = UUIDs.check(req.params.id);
      if (!id)
        res.sendStatus(400);
      else {
        await driver.delete(id);
        await dataDriver.drop(id);
        res.sendStatus(200);
      }
    }
    catch (e) {
      handleError(e, res);
    }
  });

  return metadata;
}
