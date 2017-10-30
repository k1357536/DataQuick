import { ColumnType, Column, Constraint, NumberConstraint, StringConstraint, DateConstraint, BoolConstraint } from './metadata.model';

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
    return Columns.create('Id', ColumnType.AUTO);
  }

  export function create(name: string, type?: ColumnType): Column {
    if (type === undefined)
      type = ColumnType.STRING;
    return { name, type, constraints: Constraints.getDefault(type) }
  }

  export function apiName(col: Column): string {
    return col.name.toLowerCase().replace(/ /g, '_');
  }
}

export module Constraints {
  const defNumberConstraint: NumberConstraint = { notNull: true, min: null, max: null };
  const defStringConstraint: StringConstraint = { notNull: true, regExp: null, maxLength: null };
  const defDateConstraint: DateConstraint = { notNull: true, min: null, max: null };
  const defBoolConstraint: BoolConstraint = { notNull: true };
  const defConstraint: Constraint = { notNull: true };

  export function getDefault(type: ColumnType): Constraint {
    switch (type) {
      case ColumnType.NUMBER:
        return Object.assign(defNumberConstraint);
      case ColumnType.STRING:
        return Object.assign(defNumberConstraint);
      case ColumnType.DATE:
        return Object.assign(defNumberConstraint);
      case ColumnType.BOOL:
        return Object.assign(defNumberConstraint);
      default:
        return Object.assign(defConstraint);
    }
  }
}
