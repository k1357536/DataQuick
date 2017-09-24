import { Pool, Client, QueryResult } from 'pg';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

const GETALL_STMT = "SELECT id, name, columns FROM metadata.lists;";
const GET_STMT = "SELECT id, name, columns FROM metadata.lists WHERE id = $1;";
const UPDATE_STMT = "UPDATE metadata.lists SET name = $2, columns = $3 WHERE id = $1;";
const INSERT_STMT = "INSERT INTO metadata.lists (id, name, columns) VALUES ($1, $2, $3);";
const DELETE_STMT = "DELETE FROM metadata.lists WHERE id = $1;";

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

export class MetadataDriver {
  async getAll(): Promise<Table[]> {
    const { rows } = await pool.query(GETALL_STMT);
    return rows as Table[];
  }

  async get(uuid: string): Promise<Table> {
    const { rows } = await pool.query(GET_STMT, [uuid]);
    const tables = rows as Table[];

    if (tables.length < 1)
      throw 404;

    return tables[0];
  }

  async add(tp: TableProposal): Promise<Table> {
    const id = Table.generateUUID();
    const cols = [Column.createIdColumn()];
    const { rowCount } = await pool.query(INSERT_STMT, [id, tp.name, JSON.stringify(cols)]);

    if (rowCount < 1)
      throw 400;

    return await this.get(id);
  }

  async update(table: Table): Promise<void> {
    const { rowCount } = await pool.query(UPDATE_STMT, [table.id, table.name, JSON.stringify(table.columns)]);

    if (rowCount < 1)
      throw 404;
  }

  async delete(uuid: string): Promise<void> {
    const { rowCount } = await pool.query(DELETE_STMT, [uuid]);

    if (rowCount < 1)
      throw 404;
  }
}
