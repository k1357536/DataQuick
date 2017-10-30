import { ColumnType, Column, Constraint, NumberConstraint, StringConstraint, DateConstraint, BoolConstraint } from './metadata.model';

export module ColumnTypes {
  export interface ColumnDescription {
    id: ColumnType;
    name: string;
  }

  export const ALL: ColumnDescription[] = [
    { id: ColumnType.AUTO, name: 'Key' },
    { id: ColumnType.NUMBER, name: 'Number' },
    { id: ColumnType.STRING, name: 'Text' },
    { id: ColumnType.DATE, name: 'Date' },
    { id: ColumnType.BOOL, name: 'True/False' },
  ];

  export function getName(id: ColumnType): string {
    const desc = ColumnTypes.ALL.find((t) => t.id === id);
    return desc ? desc.name : null;
  }
}

export module Columns {
  export function createIdColumn(): Column {
    return Columns.create('Id', ColumnType.AUTO);
  }

  export function create(name: string, type?: ColumnType, constraint?: Constraint): Column {
    if (!type)
      type = ColumnType.STRING;
    if (!constraint)
      constraint = Constraints.getDefault(type);
    return { name, type, constraint }
  }

  export function apiName(col: Column): string {
    return col.name.toLowerCase().replace(/ /g, '_');
  }
}

export module Constraints {
  const defConstraint: Constraint = { notNull: true, unique: false };
  const defNumberConstraint: NumberConstraint = { notNull: true, unique: false, min: null, max: null };
  const defStringConstraint: StringConstraint = { notNull: true, unique: false, regExp: null, maxLength: null };
  const defDateConstraint: DateConstraint = { notNull: true, unique: false, min: null, max: null };
  const defBoolConstraint: BoolConstraint = defConstraint;

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
