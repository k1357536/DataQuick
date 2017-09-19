import { Pool, Client, QueryResult } from 'pg';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

const GETALL_STMT = "SELECT id, name, columns FROM metadata.lists;";
const GET_STMT = "SELECT id, name, columns FROM metadata.lists WHERE id = $1;";
const UPDATE_STMT = "UPDATE metadata.lists SET name = $2, columns = $3 WHERE id = $1;";
const INSERT_STMT = "INSERT INTO metadata.lists (id, name, columns) VALUES ($1, $2, '[]');";
const DELETE_STMT = "DELETE FROM metadata.lists WHERE id = $1;";

let credentials = require('../../dbCredentials.json');
let pool = new Pool(credentials);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().catch(e => {
  console.log(e);
  process.exit(-1);
});

export class MetadataDriver {
  getAll(): Promise<Table[]> {
    return pool.query(GETALL_STMT).then(qr => qr.rows as Table[]);
  }

  get(uuid: string): Promise<Table> {
    return pool.query(GET_STMT, [uuid])
      .then(qr => qr.rows as Table[])
      .then((tables): Promise<Table> => {
        if (tables.length < 1)
          return Promise.reject(404);
        else
          return Promise.resolve(tables[0]);
      })
  }

  add(tp: TableProposal): Promise<any> {
    let id = Table.generateUUID();
    return pool.query(INSERT_STMT, [id, tp.name])
      .then(qr => {
        if (qr.rowCount < 1)
          return Promise.reject(400);
        else
          return Promise.resolve(null);
      });
  }

  update(table: Table): Promise<any> {
    return pool.query(UPDATE_STMT, [table.id, table.name, JSON.stringify(table.columns)])
      .then(qr => {
        if (qr.rowCount < 1)
          return Promise.reject(404);
        else
          return Promise.resolve(null);
      });
  }

  delete(uuid: string): Promise<any> {
    return pool.query(DELETE_STMT, [uuid])
      .then(qr => {
        if (qr.rowCount < 1)
          return Promise.reject(404);
        else
          return Promise.resolve(null);
      });
  }
}
