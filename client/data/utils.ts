import { Table, Column } from '../../shared/metadata.model';
import { Columns } from '../../shared/metadata.utils';

export interface ColumnEx extends Column {
  apiName: string;
}

export interface TableEx extends Table {
  columns: ColumnEx[];
}

export function exTable(tbl: Table): TableEx {
  (tbl as TableEx).columns.forEach(c => c.apiName = Columns.apiName(c));
  return tbl as TableEx;
}
