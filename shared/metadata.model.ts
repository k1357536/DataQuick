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
  FK = 9
}

export interface Column {
  name: string;
  type: number;
  constraint: Constraint;
}

export interface TableProposal {
  name: string;
  parent: string;
}

export interface FolderProposal {
  name: string;
  parent: string;
}

export interface Table {
  id: string;
  name: string;
  parent: string;
  columns: Column[];
}

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

export interface BoolConstraint extends Constraint {
}

export interface Folder {
  id: string;
  name: string;
  parent: string;
}
