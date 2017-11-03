export enum ColumnType {
  INVALID = 0,
  PK = 1,
  INT = 2,
  STRING = 3,
  DATE = 4,
  BOOL = 5,
  IMAGE = 6,
  MONEY = 7,
  REAL = 8,
  PERCENT = 9,
  FK = 10
}

export interface Column {
  name: string;
  type: number;
  constraint: Constraint;
  inSummary: boolean;
}

export interface FolderProposal {
  name: string;
  parent: string;
}

export interface Folder extends FolderProposal {
  id: string;
}

export interface TableProposal {
  name: string;
  parent: string;
}

export interface Table extends TableProposal {
  id: string;
  columns: Column[];
}

export type Row = { id: number, [name: string]: any };

export interface Constraint {
  notNull: boolean;
  unique: boolean;
}

export interface StringConstraint extends Constraint {
  regExp: string;
  maxLength: number;
}

export interface NumberConstraint extends Constraint {
  min: number;
  max: number;
}

export interface DateConstraint extends Constraint {
  min: Date;
  max: Date;
}

export interface FKConstraint extends Constraint {
  target: string;
}
