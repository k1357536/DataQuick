import { Client, QueryResult } from 'pg';

import { TableProposal, Table, Column } from '../../shared/metadata.model';

let dummy: Table[] = [
  new Table('99ea308a-4fc9-4daa-90ae-6138ca47e62c', 'Employees', [Column.createIdColumn()]),
  new Table('6a29a500-ef83-4eb5-b76a-d580a26613d4', 'Products', [Column.createIdColumn()])
];

export class MetadataDriver {

  getAll(): Table[] {
    return dummy;
  }

  get(uuid: string): Table {
    let t = dummy.find(t => t.id === uuid);
    if (!t)
      throw 404;
    return t;
  }

  add(tp: TableProposal): void {
    let t = Table.createDefault(tp.name);
    dummy.push(t);
  }

  update(table: Table): void {
    let index = dummy.findIndex(t => t.id === table.id);
    if (index == -1)
      throw 404;
    else
      dummy[index] = table;
  }

  delete(uuid: string): void {
    let index = dummy.findIndex(t => t.id === uuid);

    if (index == -1)
      throw 404;
    else
      dummy.splice(index, 1);
  }
}
