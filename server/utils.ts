import { Table, Column, ColumnType, Constraint } from '../shared/metadata.model';
import { Columns, ColumnTypes } from '../shared/metadata.utils';

export class Utils {
  public static generateUUID(): string { // Public Domain/MIT
    let d = new Date().getTime();

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  public static sanitizeTable(tbl: Table): Table | null {
    const nameRegEx = /^[\w ]+$/;
    const idRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    if (tbl.name == null) {
      console.log("Table has no name!");
      return null;
    } else if (!nameRegEx.test(tbl.name)) {
      console.log("Illegal table name!");
      return null;
    } else if (tbl.id == null) {
      console.log("Table has no id!");
      return null;
    } else if (!idRegEx.test(tbl.id)) {
      console.log("Illegal table id!");
      return null;
    } else if (tbl.columns == null) {
      console.log("Table has no columns!");
      return null;
    } else if (!(tbl.columns instanceof Array)) {
      console.log("Table has no columns array!");
      return null;
    }

    const result = tbl.columns.map(c => Utils.sanitizeColumn(c));
    if (result.filter(c => c === null).length > 0) {
      console.log("Table has illegal columns!");
      return null;
    }

    const cols = result as Column[];

    if (cols.filter(c => c.inSummary).length <= 0) {
      console.log("Table has no summay column(s)!");
      return null;
    }

    let parent = tbl.parent; // TODO check

    return { id: tbl.id, name: tbl.name, columns: cols, parent };
  }

  // TODO
  private static sanitizeColumn(col: Column): Column | null {
    const nameRegEx = /^[\w ]+$/;

    if (col.name == null) {
      console.log("Column has no name!");
      return null;
    }
    else if (!nameRegEx.test(col.name)) {
      console.log("Column has illegal name!");
      return null;
    }
    else if (col.type == null) {
      console.log("Column " + col.name + " has no type!");
      return null;
    }
    else if (Number(col.type) === NaN) {
      console.log("Column " + col.name + " has illegal column type id!");
      return null;
    }
    else if (!ColumnTypes.getName(Number(col.type))) {
      console.log("Column " + col.name + " has illegal column type!");
      return null;
    }
    const constraint = Utils.sanitizeConstraint(col.type, col.constraint);
    if (!constraint) {
      console.log("Column " + col.name + " has illegal constraints!");
      return null;
    }

    return Columns.create(col.name, Number(col.type), constraint, col.inSummary);
  }

  // TODO
  private static sanitizeConstraint(_type: ColumnType, constraint: Constraint): Constraint {
    return constraint;
  }
}
