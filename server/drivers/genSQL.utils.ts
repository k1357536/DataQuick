import { Table, ColumnType, Column, Constraint, NumberConstraint, StringConstraint, DateConstraint } from '../../shared/metadata.model';
import { Columns, Constraints } from '../../shared/metadata.utils';

export namespace GenSQLUtils {
  // ==== PRIVATE ==============================================================
  const SCHEMA = "data";

  const TYPES: any[] = [
    { id: ColumnType.AUTO, sqlName: 'BIGSERIAL' },
    { id: ColumnType.NUMBER, sqlName: 'INT' },
    { id: ColumnType.STRING, sqlName: 'TEXT' },
    { id: ColumnType.DATE, sqlName: 'DATE' },
    { id: ColumnType.BOOL, sqlName: 'BOOLEAN' },
  ];

  function toType(type: ColumnType, constr: Constraint): string {
    if (type === ColumnType.STRING && (constr as StringConstraint).maxLength)
      return `VARCHAR(${(constr as StringConstraint).maxLength})`;
    return TYPES.find((t) => t.id === type).sqlName;
  }

  export function toTableName(id: string): string {
    const name = SCHEMA + '."t' + id.replace(/\-/g, '_') + '"';
    return name;
  }

  function toConstraintString(col: Column): string {
    const constraint = col.constraint ? col.constraint : Constraints.getDefault(col.type);
    const name = Columns.apiName(col);

    let str = constraint.notNull ? 'NOT NULL' : 'NULL';
    if (constraint.unique)
      str += ' UNIQUE';

    switch (col.type) {
      case ColumnType.AUTO:
        return 'PRIMARY KEY';

      case ColumnType.NUMBER:
        const numConst = constraint as NumberConstraint;

        if (numConst.max)
          str += ` CHECK (${name} <= ${Number(numConst.max)})`;
        if (numConst.min)
          str += ` CHECK (${name} >= ${Number(numConst.min)})`;
        break;

      case ColumnType.STRING:
        const strConst = constraint as StringConstraint;

        if (strConst.regExp)
          str += ` CHECK (${name} ~ '${strConst.regExp}')`;
        break;

      case ColumnType.DATE:
        const dateConst = constraint as DateConstraint;

        if (dateConst.max)
          str += ` CHECK (${name} <= '${dateConst.max}')`;
        if (dateConst.min)
          str += ` CHECK (${name} >= '${dateConst.min}')`;
        break;

      case ColumnType.BOOL:
      default:
        break;
    }
    return str;
  }

  // ==== DDL ==================================================================
  export function create(table: Table): string {
    console.log(JSON.stringify(table));
    const colList = table.columns.map(col =>
      `${Columns.apiName(col)} ${toType(col.type, col.constraint)} ${toConstraintString(col)}`
    ).join(', ');
    return `CREATE TABLE ${toTableName(table.id)} (${colList});`;
  }

  export function drop(tableId: string): string {
    return `DROP TABLE ${toTableName(tableId)};`;
  }

  // ==== DML ==================================================================
  export function get(tableId: string): string {
    return `SELECT * FROM ${toTableName(tableId)} WHERE id = $1;`;
  }

  export function getAll(tableId: string, sortBy: string): string {
    return `SELECT * FROM ${toTableName(tableId)} ORDER by ${sortBy};`;
  }

  export function count(tableId: string): string {
    return `SELECT COUNT(*) FROM ${toTableName(tableId)};`;
  }

  export function insert(table: Table, entry: any): [string, any[]] {
    const cols = table.columns.filter(col => col.type !== ColumnType.AUTO);

    const data = cols.map((col) => entry[Columns.apiName(col)]);
    const colList = cols.map((col) => Columns.apiName(col)).join(', ');
    const valList = cols.map((col, i) => "$" + (i + 1)).join(', ');

    return [`INSERT INTO ${toTableName(table.id)} (${colList}) VALUES (${valList});`, data];
  }

  export function update(table: Table, entry: any): [string, any[]] {
    const cols = table.columns.filter(col => col.type !== ColumnType.AUTO);
    const id = table.columns.find(col => col.type == ColumnType.AUTO);

    const data: any[] = [];
    const colList = cols.map(
      col => {
        const name = Columns.apiName(col);
        data.push(entry[name]);
        return name + ` = $${data.length}`;
      }
    ).join(', ');
    data.push(entry[Columns.apiName(id)]);
    return [`UPDATE ${toTableName(table.id)} SET ${colList} WHERE id = $${data.length};`, data];
  }

  export function del(tableId: string): string {
    return `DELETE FROM ${toTableName(tableId)} WHERE id = $1`;
  }
}
