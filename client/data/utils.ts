import { Table, Folder, Column } from '../../shared/metadata.model';
import { Columns, Folders } from '../../shared/metadata.utils';

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

export function getPath(target: Table | Folder, folders: Folder[]): string {
  let path = '/';
  let current = target.parent;
  const root = Folders.getRoot();

  for (let i = 0; i < 1024; i++) {
    const result = folders.find(f => f.id === current);
    if (result && result.id != root.id) {
      path = '/' + result.name + path;
      current = result.parent;
    }
    else
      break;
  }
  return path;
}
