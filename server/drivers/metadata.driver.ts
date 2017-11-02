import { Pool, Client, QueryResult } from 'pg';

import { Table, TableProposal, FolderProposal, Column, Folder } from '../../shared/metadata.model';
import { Columns } from '../../shared/metadata.utils';
import { Utils } from '../utils';

const GETALL_FOLDER_STMT = 'SELECT id, name, parent FROM metadata.folders WHERE id != parent;';
const SEARCH_FOLDER1_STMT = 'SELECT id, name, parent FROM metadata.folders WHERE name LIKE $1;';
const SEARCH_FOLDER2_STMT = 'SELECT id, name, parent FROM metadata.folders WHERE name = $1 AND parent = $2;';
const INSERT_FOLDER_STMT = 'INSERT INTO metadata.folders (id, name, parent) VALUES ($1, $2, $3);';
const DELETE_FOLDER_STMT = 'DELETE FROM metadata.folders WHERE id = $1;';

const GETALL_STMT = 'SELECT id, name, parent, columns FROM metadata.lists;';
const GET_STMT = 'SELECT id, name, parent, columns FROM metadata.lists WHERE id = $1;';
const SEARCH1_STMT = 'SELECT id, name, parent, columns FROM metadata.lists WHERE name LIKE $1;';
const SEARCH2_STMT = 'SELECT id, name, parent, columns FROM metadata.lists WHERE name = $1 AND parent = $2;';
const UPDATE_STMT = 'UPDATE metadata.lists SET name = $2, parent = $3, columns = $4 WHERE id = $1;';
const INSERT_STMT = 'INSERT INTO metadata.lists (id, name, parent, columns) VALUES ($1, $2, $3, $4);';
const DELETE_STMT = 'DELETE FROM metadata.lists WHERE id = $1;';

const credentials = require('../../dbCredentials.json');
const pool = new Pool(credentials);

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.connect().catch(e => {
  console.error(e);
  process.exit(-1);
});

export class MetadataDriver {
  // === Folders ===============================================================
  async getAllFolders(): Promise<Folder[]> {
    const { rows } = await pool.query(GETALL_FOLDER_STMT);
    return rows;
  }

  async searchFolder(param: FolderProposal | string): Promise<Folder[]> {
    if (typeof param === 'string') {
      const { rows } = await pool.query(SEARCH_FOLDER1_STMT, [param]);
      return rows;
    } else {
      const p = param as FolderProposal;
      const { rows } = await pool.query(SEARCH_FOLDER2_STMT, [p.name, p.parent]);
      return rows;
    }
  }

  async addFolder(p: FolderProposal | Folder): Promise<void> {
    let id;
    if ((p as Folder).id)
      id = (p as Folder).id;
    else
      id = Utils.generateUUID();
    console.log("ADD FOLDER:", [id, p.name, p.parent]);

    const { rowCount } = await pool.query(INSERT_FOLDER_STMT, [id, p.name, p.parent]);

    if (rowCount < 1)
      throw 400;
  }

  async deleteFolder(uuid: string): Promise<void> {
    console.log("DELETE FOLDER:", [uuid]);
    const { rowCount } = await pool.query(DELETE_FOLDER_STMT, [uuid]);

    if (rowCount < 1)
      throw 404;
  }

  // === Tables ================================================================
  async getAll(): Promise<Table[]> {
    const { rows } = await pool.query(GETALL_STMT);
    return rows;
  }

  async get(uuid: string): Promise<Table> {
    const { rows } = await pool.query(GET_STMT, [uuid]);

    if (rows.length < 1)
      throw 404;

    return rows[0];
  }

  async search(param: TableProposal | string): Promise<Table[]> {
    if (typeof param === 'string') {
      const { rows } = await pool.query(SEARCH1_STMT, [param]);
      return rows;
    } else {
      const p = param as TableProposal;
      const { rows } = await pool.query(SEARCH2_STMT, [p.name, p.parent]);
      return rows;
    }
  }

  async add(p: Table | TableProposal): Promise<Table> {
    let id;
    if ((p as Table).id)
      id = (p as Table).id;
    else
      id = Utils.generateUUID();

    let cols;
    if ((p as Table).columns)
      cols = (p as Table).columns;
    else
      cols = [Columns.createPK()];

    console.log("ADD TABLE:", [id, p.name, p.parent, cols]);
    const { rowCount } = await pool.query(INSERT_STMT, [id, p.name, p.parent, JSON.stringify(cols)]);

    if (rowCount < 1)
      throw 400;

    return await this.get(id);
  }

  async update(table: Table): Promise<void> {
    console.log("UPDATE TABLE:", table);
    const { rowCount } = await pool.query(UPDATE_STMT, [table.id, table.name, table.parent, JSON.stringify(table.columns)]);

    if (rowCount < 1)
      throw 404;
  }

  async delete(uuid: string): Promise<void> {
    console.log("DELETE TABLE:", [uuid]);
    const { rowCount } = await pool.query(DELETE_STMT, [uuid]);

    if (rowCount < 1)
      throw 404;
  }
}
