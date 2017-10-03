import { Table, Column, ColumnType, ColumnTypes } from '../shared/metadata.model';

export class Utils {
  public static generateUUID(): string { // Public Domain/MIT
    let d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  public static sanitizeTable(tbl: Table): Table {
    const nameRegEx = /^[\w ]+$/;
    const idRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    if (tbl.name
      && tbl.name.length > 0
      && nameRegEx.test(tbl.name)
      && tbl.id
      && idRegEx.test(tbl.id)
      && tbl.columns
      && tbl.columns instanceof Array) {
      let t: Table = { id: tbl.id, name: tbl.name, columns: [] };
      t.columns = tbl.columns.map(c => Utils.sanitizeColumn(c));
      if (t.columns.filter(c => c === null).length > 0)
        return null;
      else
        return t;
    } else
      return null;
  }

  // TODO
  private static sanitizeColumn(col: Column): Column {
    const nameRegEx = /^[\w ]+$/;

    if (col.name != null
      && col.name.length > 0
      && nameRegEx.test(col.name)
      && col.type != null
      && Number(col.type) !== NaN
      && ColumnTypes.get(col.type)
      && col.readonly != null
      && col.key != null)
      return {
        name: col.name, type: Number(col.type), readonly: col.readonly, key: col.key
      };
    else
      return null;
  }

  // TODO
  public static toSQL(tbl: Table): string {
    let tableSQL = 'CEATE TABLE "' + this.name + '" (';
    let b = false;
    for (let col of tbl.columns) {
      if (b)
        tableSQL += ', ';

      tableSQL += '"' + Utils.sqlName(col) + '" ';
      if (col.key)
        tableSQL += 'PRIMARY KEY ';

      tableSQL += ColumnTypes.get(col.type).name;

      b = true;
    }
    tableSQL += ');';
    return tableSQL;
  }

  private static sqlName(col: Column): string {
    return col.name.replace(' ', '_');
  }
}
