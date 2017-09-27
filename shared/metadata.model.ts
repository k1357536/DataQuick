export enum ColumnType {
  AUTO = 0,
  NUMBER = 1,
  STRING = 2,
  DATE = 3,
  BOOL = 4
}

export module ColumnTypes {
  export interface ColumnDescription {
    id: ColumnType;
    name: string;
    sqlName: string;
  }

  export const ALL: ColumnDescription[] = [
    { id: ColumnType.AUTO, name: 'Auto Increment', sqlName: 'INT AUTO INCREMENT' },
    { id: ColumnType.NUMBER, name: 'Number', sqlName: 'INT' },
    { id: ColumnType.STRING, name: 'Text', sqlName: 'STRING' },
    { id: ColumnType.DATE, name: 'Date', sqlName: 'DATE' },
    { id: ColumnType.BOOL, name: 'Yes/No', sqlName: 'BOOLEAN' },
  ];

  export function get(id: ColumnType): ColumnDescription {
    return ColumnTypes.ALL.find((t) => t.id === id);
  }
}

export interface Column {
  name: string;
  type: number;
  readonly: boolean;
  key: boolean;
}

export module Columns {
  export function createIdColumn(): Column {
    return { name: 'Id', type: ColumnTypes.get(ColumnType.AUTO).id, readonly: true, key: true };
  }

  export function create(name: string): Column {
    return { name, type: ColumnType.STRING, key: false, readonly: false }
  }
}

export interface TableProposal {
  name: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}
