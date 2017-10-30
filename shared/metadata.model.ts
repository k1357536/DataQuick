export enum ColumnType {
  AUTO = 0,
  NUMBER = 1,
  STRING = 2,
  DATE = 3,
  BOOL = 4
}

export interface Column {
  name: string;
  type: number;
  constraints: Constraint;
}

export interface TableProposal {
  name: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}

export interface Constraint {
  notNull: boolean;
}

export interface StringConstraint extends Constraint {
  regExp: RegExp;
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
