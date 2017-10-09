import * as express from 'express';
import { Router, Response } from 'express';

import { DataDriver } from '../drivers/data.driver';

export function DataApi(): Router {
  const data = express.Router();
  const driver = new DataDriver();

  function handleError(e: any, res: Response) {
    if (Number(e) !== NaN)
      res.sendStatus(Number(e));
    else
      res.sendStatus(500);
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
      res.json(await driver.getAll(req.params.id));
    }
    catch (e) {
      handleError(e, res);
    }
  });
  data.get('/:id/:entry', async (req, res) => {
    try {
      res.json(await driver.get(req.params.id, req.params.entry));
    }
    catch (e) {
      handleError(e, res);
    }
  });

  return data;
}
