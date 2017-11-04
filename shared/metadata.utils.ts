import { UUID, ColumnType, Column, Constraint, NumberConstraint, StringConstraint, DateConstraint, FKConstraint, Folder } from './metadata.model';

export module UUIDs {
  export function check(id: string | UUID | null): UUID | null {
    if (id == null)
      return null;
    return <UUID>id; // do check
  }
}

// ==== Folder =================================================================
export module Folders {
  export function getRoot(): Folder {
    return { id: <UUID>'00000000-0000-0000-0000-000000000000', name: '', parent: <UUID>'00000000-0000-0000-0000-000000000000' };
  }
}

// ==== Column =================================================================
export module ColumnTypes {
  export interface ColumnDescription {
    id: ColumnType;
    name: string;
  }

  export const ALL: ColumnDescription[] = [
    { id: ColumnType.PK, name: 'Key' },
    { id: ColumnType.INT, name: 'Whole Number' },
    { id: ColumnType.STRING, name: 'Text' },
    { id: ColumnType.DATE, name: 'Date' },
    { id: ColumnType.BOOL, name: 'True/False' },
    { id: ColumnType.IMAGE, name: 'Image' },
    { id: ColumnType.MONEY, name: 'Money' },
    { id: ColumnType.REAL, name: 'Decimal Number' },
    { id: ColumnType.PERCENT, name: 'Percentage' },
    { id: ColumnType.FK, name: 'Reference' },
  ];

  export function getName(id: ColumnType): string {
    const desc = ColumnTypes.ALL.find((t) => t.id === id);
    return desc ? desc.name : 'Other';
  }
}

export module Columns {
  export function createPK(): Column {
    const col = Columns.create('Id', ColumnType.PK);
    col.inSummary = true;
    return col;
  }

  export function create(name: string, type?: ColumnType, constraint?: Constraint, inSummary?: boolean): Column {
    if (!type)
      type = ColumnType.STRING;
    if (!constraint)
      constraint = Constraints.getDefault(type);
    return { name, type, constraint, inSummary: inSummary ? true : false };
  }

  export function apiName(col: Column): string {
    return col.name.toLowerCase().replace(/ /g, '_');
  }
}

// ==== Constraints ============================================================
export module Constraints {
  const defConstraint: Constraint = { notNull: true, unique: false };
  const defNumberConstraint: NumberConstraint = { notNull: true, unique: false, min: null, max: null };
  const defPercentConstraint: NumberConstraint = { notNull: true, unique: false, min: 0, max: 1 };
  const defStringConstraint: StringConstraint = { notNull: true, unique: false, regExp: null, maxLength: null };
  const defDateConstraint: DateConstraint = { notNull: true, unique: false, min: null, max: null };
  const defFKConstraint: FKConstraint = { notNull: true, unique: false, target: <UUID>'' };

  export function getDefault(type: ColumnType): Constraint {
    switch (type) {
      case ColumnType.INT:
      case ColumnType.MONEY:
      case ColumnType.REAL:
        return Object.assign(defNumberConstraint);
      case ColumnType.STRING:
        return Object.assign(defStringConstraint);
      case ColumnType.DATE:
        return Object.assign(defDateConstraint);
      case ColumnType.PERCENT:
        return Object.assign(defPercentConstraint);
      case ColumnType.FK:
        return Object.assign(defFKConstraint);
      case ColumnType.PK:
      case ColumnType.BOOL:
      case ColumnType.IMAGE:
      default:
        return Object.assign(defConstraint);
    }
  }
}
