import { Pool, Client, QueryResult } from 'pg';

import { TableProposal, Table, Column, ColumnType } from '../../shared/metadata.model';
import { Columns, ColumnTypes } from '../../shared/metadata.utils';

import { GenSQLUtils } from './genSQL.utils';

const credentials = require('../../dbCredentials.json');
const pool = new Pool(credentials);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().catch(e => {
  console.log(e);
  process.exit(-1);
});

export class DataDriver {
  private static readonly idRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  async count(tableId: string): Promise<number> {
    if (!DataDriver.idRegEx.test(tableId))
      throw 400;
    try {
      const { rows } = await pool.query(GenSQLUtils.count(tableId));

      if (rows.length < 1)
        throw 404;

      return Number(rows[0].count);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async getAll(table: Table, sortBy?: string): Promise<any[]> {
    let sortCol = table.columns.find(c => Columns.apiName(c) === sortBy);
    if (!sortCol)
      sortCol = table.columns.find(c => c.type === ColumnType.AUTO);
    if (!sortCol)
      throw 400;

    try {
      const { rows } = await pool.query(GenSQLUtils.getAll(table.id, Columns.apiName(sortCol)));
      return rows;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async get(tableId: string, entryId: string): Promise<any[]> {
    let eid = Number(entryId);
    if (!DataDriver.idRegEx.test(tableId) || eid != NaN)
      throw 400;

    const stmt = GenSQLUtils.get(tableId);
    try {
      const { rows } = await pool.query(stmt, [eid]);
      if (rows.length < 1)
        throw 400;

      return rows[0];
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async update(table: Table, entry: any): Promise<void> {
    let eid = Number(entry.id);
    if (!DataDriver.idRegEx.test(table.id) && eid != NaN)
      throw 400;

    const [stmt, data] = GenSQLUtils.update(table, entry);
    console.log(stmt, data);
    try {
      const { rowCount } = await pool.query(stmt, data);
      if (rowCount < 1)
        throw 404;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async insert(table: Table, entry: any): Promise<void> {
    let eid = Number(entry.id);
    if (!DataDriver.idRegEx.test(table.id) && eid != NaN)
      throw 400;

    const [stmt, data] = GenSQLUtils.insert(table, entry);
    console.log(stmt, data);
    try {
      const { rowCount } = await pool.query(stmt, data);
      if (rowCount < 1)
        throw 404;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async delete(tableId: string, entryId: string): Promise<void> {
    let eid = Number(entryId);
    if (!DataDriver.idRegEx.test(tableId) && eid != NaN)
      throw 400;

    const stmt = GenSQLUtils.del(tableId);
    try {
      const { rowCount } = await pool.query(stmt, [eid]);

      if (rowCount < 1)
        throw 404;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async create(table: Table): Promise<void> {
    if (!DataDriver.idRegEx.test(table.id))
      throw 400;

    let sql = GenSQLUtils.create(table);
    console.log("SQL:" + sql);
    try {
      await pool.query(sql);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async drop(id: string): Promise<void> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    let sql = GenSQLUtils.drop(id);
    console.log("SQL:" + sql);
    try {
      await pool.query(sql);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }
}
