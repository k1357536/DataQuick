export class ColumnType {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly sqlName: string) { }

  public static readonly AUTO: ColumnType = new ColumnType(0, "Auto Increment", "INT AUTO INCREMENT");
  public static readonly NUMBER: ColumnType = new ColumnType(1, "Number", "INT");
  public static readonly STRING: ColumnType = new ColumnType(2, "Text", "STRING");
  public static readonly DATE: ColumnType = new ColumnType(3, "Date", "DATE");
  public static readonly BOOL: ColumnType = new ColumnType(4, "Yes/No", "BOOLEAN");

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
    public type: ColumnType,
    public readonly: boolean,
    public key: boolean) { }

  public get sqlName(): string {
    return this.name.replace(' ', '_');
  }

  public static createIdColumn(): Column {
    return new Column("Id", ColumnType.AUTO, true, true);
  }
}

export class Table {
  public name: string = "";
  public columns: Column[] = [];

  public static createDefault(name?: string): Table {
    let tbl = new Table();
    if (name != null)
      tbl.name = name;
    tbl.columns.push(Column.createIdColumn());
    return tbl;
  }
}
