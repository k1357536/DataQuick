import { Table, ColumnType, Column, Constraint, NumberConstraint, StringConstraint, DateConstraint, FKConstraint } from '../../shared/metadata.model';
import { Columns, Constraints } from '../../shared/metadata.utils';

export namespace GenSQLUtils {
  // ==== PRIVATE ==============================================================
  const SCHEMA = "data";

  const TYPES: any[] = [
    { id: ColumnType.PK, sqlName: 'BIGSERIAL' },
    { id: ColumnType.INT, sqlName: 'INT' },
    { id: ColumnType.STRING, sqlName: 'TEXT' },
    { id: ColumnType.DATE, sqlName: 'DATE' },
    { id: ColumnType.BOOL, sqlName: 'BOOLEAN' },
    { id: ColumnType.IMAGE, sqlName: 'BYTEA' },
    { id: ColumnType.MONEY, sqlName: 'NUMERIC(12,2)' },
    { id: ColumnType.REAL, sqlName: 'REAL' },
    { id: ColumnType.PERCENT, sqlName: 'REAL' },
    { id: ColumnType.FK, sqlName: 'BIGINT' },
  ];

  function toType(type: ColumnType, constr: Constraint): string {
    if (type === ColumnType.STRING && (constr as StringConstraint).maxLength)
      return `VARCHAR(${(constr as StringConstraint).maxLength})`;
    return TYPES.find((t) => t.id === type).sqlName;
  }

  function toEscapedName(col: Column): string {
    return '"' + Columns.apiName(col) + '"';
  }

  export function toTableName(id: string): string {
    const name = SCHEMA + '."t' + id.replace(/\-/g, '_') + '"';
    return name;
  }

  function toConstraintString(col: Column): string {
    const constraint = col.constraint ? col.constraint : Constraints.getDefault(col.type);
    const name = toEscapedName(col);

    let str = constraint.notNull ? 'NOT NULL' : 'NULL';
    if (constraint.unique)
      str += ' UNIQUE';

    switch (col.type) {
      case ColumnType.PK:
        return 'PRIMARY KEY';

      case ColumnType.INT:
      case ColumnType.MONEY:
      case ColumnType.REAL:
      case ColumnType.PERCENT:
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

      case ColumnType.FK:
        const fkConst = constraint as FKConstraint;
        str += ` REFERENCES ${toTableName(fkConst.target)}`;
        break;

      case ColumnType.BOOL:
      case ColumnType.IMAGE:
      default:
        break;
    }
    return str;
  }

  // ==== DDL ==================================================================
  export function create(table: Table): string {
    const colList = table.columns.map(col =>
      `${toEscapedName(col)} ${toType(col.type, col.constraint)} ${toConstraintString(col)}`
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

  export function getAll(tableId: string, sortBy: string, sortASC: boolean): string {
    return `SELECT * FROM ${toTableName(tableId)} ORDER by ${sortBy} ${sortASC ? 'ASC' : 'DESC'};`;
  }

  export function getRange(tableId: string, sortBy: string, sortASC: boolean, start: number, num: number): string {
    return `SELECT * FROM ${toTableName(tableId)} ORDER by ${sortBy} ${sortASC ? 'ASC' : 'DESC'} LIMIT ${num} OFFSET ${start};`;
  }

  export function count(tableId: string): string {
    return `SELECT COUNT(*) FROM ${toTableName(tableId)};`;
  }

  export function insert(table: Table, entry: any): [string, any[]] {
    const cols = table.columns.filter(col => col.type !== ColumnType.PK);

    const data = cols.map((col) => entry[Columns.apiName(col)]);
    const colList = cols.map((col) => toEscapedName(col)).join(', ');
    const valList = cols.map((_, i) => "$" + (i + 1)).join(', ');

    return [`INSERT INTO ${toTableName(table.id)} (${colList}) VALUES (${valList});`, data];
  }

  export function update(table: Table, entry: any): [string, any[]] {
    const cols = table.columns.filter(col => col.type !== ColumnType.PK);
    const id = table.columns.find(col => col.type == ColumnType.PK);

    if (id === undefined)
      throw new Error('primary key not found!');

    const data: any[] = [];
    const colList = cols.map(
      col => {
        data.push(entry[Columns.apiName(col)]);
        return toEscapedName(col) + ` = $${data.length}`;
      }
    ).join(', ');
    data.push(entry[Columns.apiName(id)]);
    return [`UPDATE ${toTableName(table.id)} SET ${colList} WHERE id = $${data.length};`, data];
  }

  export function del(tableId: string): string {
    return `DELETE FROM ${toTableName(tableId)} WHERE id = $1`;
  }
}
