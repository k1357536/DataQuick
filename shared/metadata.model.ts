// ==== UUID ===================================================================
export enum UuidTag { };
export type UUID = string & UuidTag;

// ==== Folder =================================================================
export interface FolderProposal {
  name: string;
  parent: UUID;
}

export interface Folder extends FolderProposal {
  id: UUID;
}

// ==== Column =================================================================
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

// ==== Table ==================================================================
export interface TableProposal {
  name: string;
  parent: string;
}

export interface Table extends TableProposal {
  id: UUID;
  columns: Column[];
}

// ==== Row ====================================================================
export type Row = { id: number, [name: string]: any };

// ==== Constraints ============================================================
export interface Constraint {
  notNull: boolean;
  unique: boolean;
}

export interface StringConstraint extends Constraint {
  regExp: string | null;
  maxLength: number | null;
}

export interface NumberConstraint extends Constraint {
  min: number | null;
  max: number | null;
}

export interface DateConstraint extends Constraint {
  min: Date | null;
  max: Date | null;
}

export interface FKConstraint extends Constraint {
  target: UUID;
}
