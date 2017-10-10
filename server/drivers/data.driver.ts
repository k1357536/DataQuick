import { Pool, Client, QueryResult } from 'pg';

import { TableProposal, Table, Column, Columns, ColumnTypes } from '../../shared/metadata.model';

const SCHEMA = "data";

const COUNT_STMT = "SELECT COUNT(*) FROM ";
const GET_STMT = "SELECT * FROM ";
const GET_CLAUSE = " WHERE id = $1";

const CREATE_STMT = "CREATE TABLE ";
const DROP_STMT = "DROP TABLE ";
// const GET_STMT = "SELECT id, name, columns FROM metadata.lists WHERE id = $1;";
// const INSERT_STMT = "INSERT INTO metadata.lists (id, name, columns) VALUES ($1, $2, $3);";
// const DELETE_STMT = "DELETE FROM metadata.lists WHERE id = $1;";

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

  private static toTableName(id: string): string {
    const name = SCHEMA + '."t' + id.replace(/\-/g, '_') + '"';
    return name;
  }

  async count(id: string): Promise<number> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    const { rows } = await pool.query(COUNT_STMT + DataDriver.toTableName(id) + ";");

    if (rows.length < 1)
      throw 404;

    return Number(rows[0].count);
  }

  async getAll(id: string): Promise<any[]> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    const { rows } = await pool.query(GET_STMT + DataDriver.toTableName(id) + ";");
    return rows;
  }

  async get(tableId: string, entryId: string): Promise<any[]> {
    let eid = Number(entryId);
    if (!DataDriver.idRegEx.test(tableId) && eid != NaN)
      throw 400;

    const stmt = GET_STMT + DataDriver.toTableName(tableId) + GET_CLAUSE + ";";
    const { rows } = await pool.query(stmt, [eid]);

    if (rows.length < 1)
      throw 400;

    return rows[0];
  }

  async update(table: Table, entry: any): Promise<void> {
    const [stmt, data] = this.toUpdateSQL(table, entry);
    console.log(stmt, data);
    try {
      const { rowCount } = await pool.query(stmt, data);
      if (rowCount < 1)
        throw 404;
    } catch (e) {
      throw 500;
    }
  }

  async create(table: Table): Promise<void> {
    if (!DataDriver.idRegEx.test(table.id))
      throw 400;

    try {
      let sql = this.toCreateSQL(table);
      console.log("SQL:" + sql);
      const qr = await pool.query(sql);
    } catch (e) {
      throw 500;
    }
  }

  async drop(id: string): Promise<void> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    try {
      let sql = DROP_STMT + DataDriver.toTableName(id) + ";";
      console.log("SQL:" + sql);
      const qr = await pool.query(sql);
    } catch (e) {
      throw 500;
    }
  }

  toCreateSQL(table: Table): string {
    return CREATE_STMT
      + DataDriver.toTableName(table.id)
      + ' ('
      + table.columns.map(
        col => Columns.apiName(col) + ' ' + ColumnTypes.get(col.type).sqlName
      ).join(', ')
      + ');';
  }

  toUpdateSQL(table: Table, entry: any): [string, any[]] {
    const data: any[] = [];
    const stmt = "UPDATE "
      + DataDriver.toTableName(table.id)
      + ' SET '
      + table.columns.map(
        (col, i) => {
          const name = Columns.apiName(col);
          data[i] = entry[name];
          return name + " = $" + (i + 1);
        }
      ).join(', ')
      + ';';

    return [stmt, data];
  }
}
