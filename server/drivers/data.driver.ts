import { Pool, QueryResult } from 'pg';

import { UUID, Column, Table, Row } from '../../shared/metadata.model';
import { Columns } from '../../shared/metadata.utils';

import { GenSQLUtils } from './genSQL.utils';

const credentials = require('../../dbCredentials.json');
const pool = new Pool(credentials);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().catch(e => {
  console.error(e);
  process.exit(-1);
});

const DROP_SCHEMA_STMT = 'DROP SCHEMA data CASCADE;';
const CREATE_SCHEMA_STMT = 'CREATE SCHEMA data;';

export class DataDriver {
  private static readonly idRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  async count(tableId: UUID): Promise<number> {
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

  async getAll(table: Table, sortBy: string = 'id', sortASC: boolean = true, page?: number, pageSize?: number): Promise<Row[]> {
    let sortCol = table.columns.find(c => Columns.apiName(c) === sortBy);
    if (!sortCol)
      sortCol = table.columns.find(c => c.type === 'PK');
    if (!sortCol)
      throw 400;

    try {
      let res: Promise<QueryResult>;
      if (page && pageSize)
        res = pool.query(GenSQLUtils.getRange(table.id, Columns.apiName(sortCol), sortASC, page * pageSize, pageSize));
      else
        res = pool.query(GenSQLUtils.getAll(table.id, Columns.apiName(sortCol), sortASC));
      return (await res).rows;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async get(tableId: UUID, entryId: string): Promise<Row> {
    let eid = Number(entryId);
    if (!DataDriver.idRegEx.test(tableId) || Number.isNaN(eid))
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

  async getSummaries(table: Table, col: Column): Promise<Row[]> {
    const stmt = GenSQLUtils.getSummaries(table.id, Columns.apiName(col));
    try {
      const { rows } = await pool.query(stmt);
      return rows;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async update(table: Table, entry: Row): Promise<void> {
    let eid = Number(entry.id);
    if (!DataDriver.idRegEx.test(table.id) && eid != NaN)
      throw 400;

    const [stmt, data] = GenSQLUtils.update(table, entry);
    console.log("UPDATE STMT:", stmt, data);
    try {
      const { rowCount } = await pool.query(stmt, data);
      if (rowCount < 1)
        throw 404;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async insert(table: Table, entry: Row): Promise<void> {
    let eid = Number(entry.id);
    if (!DataDriver.idRegEx.test(table.id) && eid != NaN)
      throw 400;

    const [stmt, data] = GenSQLUtils.insert(table, entry);
    console.log("INSERT STMT:", stmt, data);
    try {
      const { rowCount } = await pool.query(stmt, data);
      if (rowCount < 1)
        throw 404;
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async delete(tableId: UUID, entryId: string): Promise<void> {
    let eid = Number(entryId);
    if (!DataDriver.idRegEx.test(tableId) && eid != NaN)
      throw 400;

    const stmt = GenSQLUtils.del(tableId);
    console.log("DELETE STMT:", stmt, eid);
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

    let stmt = GenSQLUtils.create(table);
    console.log("CREATE STMT:", stmt);
    try {
      await pool.query(stmt);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async dropAll(): Promise<void> {
    try {
      await pool.query(DROP_SCHEMA_STMT);
      await pool.query(CREATE_SCHEMA_STMT);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }

  async drop(id: UUID): Promise<void> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    let stmt = GenSQLUtils.drop(id);
    console.log("DROP STMT:", stmt);
    try {
      await pool.query(stmt);
    }
    catch (e) {
      throw e.detail ? e.detail : e;
    }
  }
}
