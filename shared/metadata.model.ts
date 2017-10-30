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
}

export interface TableProposal {
  name: string;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}
