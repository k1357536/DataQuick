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

  console.log('create table lists');
  await client.query('CREATE TABLE metadata.lists ('
    + 'id uuid PRIMARY KEY, '
    + 'name varchar(20) NOT NULL, '
    + 'columns jsonb NOT NULL, '
    + 'UNIQUE(name))');

  console.log('create table dependencies');
  await client.query('CREATE TABLE metadata.dependencies ('
    + 'reference uuid REFERENCES metadata.lists(id) ON DELETE CASCADE, '
    + 'tgt uuid REFERENCES metadata.lists(id) ON DELETE RESTRICT, '
    + 'PRIMARY KEY(reference, tgt))');

  console.log('done');
  await client.end();
  } catch(e) {
    console.log(e);
  }
})();
