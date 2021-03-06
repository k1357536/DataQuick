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
export type ColumnType = 'PK' | 'FK' |
  'STRING' |
  'INT' | 'MONEY' |
  'REAL' | 'PERCENT' |
  'DATE' |
  'BOOL' |
  'IMAGE';

export interface Column {
  name: string;
  type: ColumnType;
  constraint: Constraint;
  inSummary: boolean;
}

// ==== Table ==================================================================
export interface TableProposal {
  name: string;
  parent: UUID;
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
