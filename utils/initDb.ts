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
  console.log("create tables");
  return client.query('CREATE TABLE metadata.lists ('
    + 'sqlName uuid PRIMARY KEY, '
    + 'prettyName varchar(20) NOT NULL, '
    + 'columns jsonb NOT NULL, '
    + 'UNIQUE(prettyName))');
}).then(qr => {
  return client.query('CREATE TABLE metadata.dependencies ('
    + 'pk uuid REFERENCES metadata.lists(sqlName) ON DELETE RESTRICT, '
    + 'fk uuid REFERENCES metadata.lists(sqlName) ON DELETE CASCADE, '
    + 'PRIMARY KEY(pk, fk))');
}).then(qr => {
  console.log("done");
  process.exit()
}).catch(e => {
  console.log("error: " + e);
  process.exit()
});
