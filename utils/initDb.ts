import { Client, QueryResult } from 'pg';

let credentials = require('../dbCredentials.json');
let client = new Client(credentials);
client.connect().then(() => {
  console.log("drop schemas");
  return Promise.all([
    client.query("DROP SCHEMA IF EXISTS data CASCADE;"),
    client.query("DROP SCHEMA IF EXISTS metadata CASCADE;")
  ])
}).then(qr => {
  console.log("create schemas");
  // TODO: potential SQL injection
  return Promise.all([
    client.query('CREATE SCHEMA data AUTHORIZATION "' + credentials.user + '";'),
    client.query('CREATE SCHEMA metadata AUTHORIZATION "' + credentials.user + '";')
  ])
}).then(qr => {
  console.log("create table lists");
  return client.query('CREATE TABLE metadata.lists ('
    + 'id uuid PRIMARY KEY, '
    + 'name varchar(20) NOT NULL, '
    + 'columns jsonb NOT NULL, '
    + 'UNIQUE(name))');
}).then(qr => {
  console.log("create table dependencies");
  return client.query('CREATE TABLE metadata.dependencies ('
    + 'reference uuid REFERENCES metadata.lists(id) ON DELETE CASCADE, '
    + 'tgt uuid REFERENCES metadata.lists(id) ON DELETE RESTRICT, '
    + 'PRIMARY KEY(reference, tgt))');
}).then(qr => {
  console.log("done");
  process.exit()
}).catch(e => {
  console.log("error: " + e);
  process.exit()
});
