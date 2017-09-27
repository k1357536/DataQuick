import { Pool, Client, QueryResult } from 'pg';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

const COUNT_STMT = "SELECT COUNT(*) FROM data.";
const GETALL_STMT = "SELECT * FROM data.";

const CREATE_STMT = "CREATE TABLE data.";
const DROP_STMT = "DROP TABLE data.";
// const GET_STMT = "SELECT id, name, columns FROM metadata.lists WHERE id = $1;";
// const UPDATE_STMT = "UPDATE metadata.lists SET name = $2, columns = $3 WHERE id = $1;";
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
    const name = 't' + id.replace(/\-/g, '_');
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

    const { rows } = await pool.query(GETALL_STMT + DataDriver.toTableName(id) + ";");
    return rows;
  }

  async create(table: Table): Promise<void> {
    if (!DataDriver.idRegEx.test(table.id))
      throw 400;

    try {
      const qr = await pool.query(CREATE_STMT + DataDriver.toTableName(table.id) + "(Id SERIAL PRIMARY KEY, A TEXT);");
    } catch (e) {
      throw 500;
    }
  }

  async drop(id: string): Promise<void> {
    if (!DataDriver.idRegEx.test(id))
      throw 400;

    try {
      const qr = await pool.query(DROP_STMT + DataDriver.toTableName(id) + ";");
    } catch (e) {
      throw 500;
    }
  }
}
