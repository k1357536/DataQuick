import { Component } from '@angular/core';

class ColumnType {
  id: number;
  name: string;
  SQL: string;
}

const AUTO: ColumnType = { id: 0, name: "Auto Increment", SQL: "INT AUTO INCREMENT" },
  NUMBER: ColumnType = { id: 1, name: "Number", SQL: "INT" },
  STRING: ColumnType = { id: 2, name: "Text", SQL: "STRING" },
  DATE: ColumnType = { id: 3, name: "Date", SQL: "DATE" },
  BOOL: ColumnType = { id: 4, name: "Yes/No", SQL: "BOOLEAN" };

class Column {
  name: string = "";
  type: ColumnType = STRING;
  readonly: boolean = false;
  key: boolean = false;
}

@Component({
  selector: 'table-editor',
  templateUrl: './table-editor.component.html'
})

export class TableEditorComponent {
  tableName: string = "Table 1";
  tableSQL: string = "";

  columnTypes: ColumnType[] = [
    AUTO,
    NUMBER,
    STRING,
    DATE,
    BOOL
  ];

  columns: Column[] = [{
    name: "Id",
    type: AUTO,
    readonly: true,
    key: true,
  }];

  add(): void {
    let c = new Column();
    this.columns.push(c);
  }

  changeType(col: Column, type: number) {
    col.type = this.columnTypes[type];
    console.log(col);
  }

  save(): void {
    this.tableSQL = "CEATE TABLE \"" + this.tableName + "\" (";
    let b = false;
    for (let col of this.columns) {
      if (b)
        this.tableSQL += ", ";

      this.tableSQL += col.name + " ";
      if (col.key)
        this.tableSQL += "PRIMARY KEY ";

      this.tableSQL += col.type.SQL;

      b = true;
    }
    this.tableSQL += ");";
  }
}
