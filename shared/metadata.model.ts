export class ColumnType {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly sqlName: string) { }

  public static readonly AUTO: ColumnType = new ColumnType(0, 'Auto Increment', 'INT AUTO INCREMENT');
  public static readonly NUMBER: ColumnType = new ColumnType(1, 'Number', 'INT');
  public static readonly STRING: ColumnType = new ColumnType(2, 'Text', 'STRING');
  public static readonly DATE: ColumnType = new ColumnType(3, 'Date', 'DATE');
  public static readonly BOOL: ColumnType = new ColumnType(4, 'Yes/No', 'BOOLEAN');

  public static readonly ALL_TYPES: ColumnType[] = [
    ColumnType.AUTO,
    ColumnType.NUMBER,
    ColumnType.STRING,
    ColumnType.DATE,
    ColumnType.BOOL
  ];

  public static getById(id: number): ColumnType {
    return ColumnType.ALL_TYPES.find((t) => t.id == id);
  }
}

export class Column {
  constructor(
    public name: string,
    public type: number,
    public readonly: boolean,
    public key: boolean) { }

  public get sqlName(): string {
    return this.name.replace(' ', '_');
  }

  // TODO
  public static sanitize(col: Column): Column {
    const nameRegEx = /^[\w ]+$/;

    console.log([col.name, ColumnType.getById(col.type)]);

    if (col.name != null
      && col.name.length > 0
      && nameRegEx.test(col.name)
      && col.type != null
      && Number(col.type) !== NaN
      && ColumnType.getById(col.type) != null
      && col.readonly != null
      && col.key != null)
      return new Column(col.name, Number(col.type), col.readonly, col.key);
    else
      return null;
  }

  public static createIdColumn(): Column {
    return new Column('Id', ColumnType.AUTO.id, true, true);
  }
}

export class TableProposal {
  constructor(public name: string = '') { }
}

export class Table {
  constructor(public id: string = '',
    public name: string = '',
    public columns: Column[] = []) { }

  public static createDefault(name?: string, uuid?: string): Table {
    let tbl = new Table();
    if (name != null)
      tbl.name = name;
    if (uuid != null)
      tbl.id = uuid;
    else
      tbl.id = Table.generateUUID();
    tbl.columns.push(Column.createIdColumn());
    return tbl;
  }

  // TODO
  public toSQL(): string {
    let tableSQL = 'CEATE TABLE "' + this.name + '" (';
    let b = false;
    for (let col of this.columns) {
      if (b)
        tableSQL += ", ";

      tableSQL += '"' + col.sqlName + '" ';
      if (col.key)
        tableSQL += "PRIMARY KEY ";

      let t = ColumnType.getById(col.type);
      if (t)
        tableSQL += t.sqlName;
      else
        tableSQL += ColumnType.NUMBER.sqlName; // TODO

      b = true;
    }
    tableSQL += ");";
    return tableSQL;
  }

  public static sanitize(tbl: Table): Table {
    const nameRegEx = /^[\w ]+$/;
    const idRegEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    if (tbl.name
      && tbl.name.length > 0
      && nameRegEx.test(tbl.name)
      && tbl.id
      && idRegEx.test(tbl.id)
      && tbl.columns
      && tbl.columns instanceof Array) {
      let t = new Table(tbl.id, tbl.name);
      t.columns = tbl.columns.map(c => Column.sanitize(c));
      if (t.columns.filter(c => c === null).length > 0)
        return null;
      else
        return t;
    } else
      return null;
  }

  private static generateUUID(): string { // Public Domain/MIT
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}
