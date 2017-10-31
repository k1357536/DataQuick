import { Client } from 'pg';

(async () => {
  try {
    let credentials = require('../dbCredentials.json');
    let client = new Client(credentials);
    await client.connect();

    console.log('drop schemas');
    await client.query('DROP SCHEMA IF EXISTS data CASCADE;');
    await client.query('DROP SCHEMA IF EXISTS metadata CASCADE;');

    console.log('create schemas');
    // TODO: potential SQL injection
    await client.query('CREATE SCHEMA data AUTHORIZATION "' + credentials.user + '";');
    await client.query('CREATE SCHEMA metadata AUTHORIZATION "' + credentials.user + '";');

    console.log('create table folders');
    await client.query('CREATE TABLE metadata.folders ('
      + 'id uuid PRIMARY KEY, '
      + 'name text NOT NULL, '
      + 'parent uuid NOT NULL REFERENCES metadata.folders(id), '
      + 'UNIQUE(parent, name));');

    console.log('create table lists');
    await client.query('CREATE TABLE metadata.lists ('
      + 'id uuid PRIMARY KEY, '
      + 'name text NOT NULL, '
      + 'parent uuid NOT NULL REFERENCES metadata.folders(id), '
      + 'columns jsonb NOT NULL, '
      + 'UNIQUE(parent, name));');

    console.log('create root folder');
    const rootId = '00000000-0000-0000-0000-000000000000';
    await client.query('INSERT INTO metadata.folders (id, name, parent)'
      + ` VALUES ('${rootId}', '','${rootId}')`);

    console.log('done');
    await client.end();
  } catch (e) {
    console.log(e);
  }
})();
