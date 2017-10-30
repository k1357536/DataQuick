import { ColumnType, Column } from './metadata.model';

export module ColumnTypes {
  export interface ColumnDescription {
    id: ColumnType;
    name: string;
    sqlName: string;
  }

  export const ALL: ColumnDescription[] = [
    { id: ColumnType.AUTO, name: 'Key', sqlName: 'BIGSERIAL PRIMARY KEY' },
    { id: ColumnType.NUMBER, name: 'Number', sqlName: 'INT' },
    { id: ColumnType.STRING, name: 'Text', sqlName: 'TEXT' },
    { id: ColumnType.DATE, name: 'Date', sqlName: 'DATE' },
    { id: ColumnType.BOOL, name: 'True/False', sqlName: 'BOOLEAN' },
  ];

  export function get(id: ColumnType): ColumnDescription {
    return ColumnTypes.ALL.find((t) => t.id === id);
  }
}

export module Columns {
  export function createIdColumn(): Column {
    return { name: 'Id', type: ColumnTypes.get(ColumnType.AUTO).id };
  }

  export function create(name: string, type?: ColumnType): Column {
    if (type === undefined)
      type = ColumnType.STRING;
    return { name, type }
  }

  export function apiName(col: Column): string {
    return col.name.toLowerCase().replace(/ /g, '_');
  }
}
