import { Component } from '@angular/core';

import { Table, Column, ColumnType } from '../shared/metadata.model'

@Component({
  selector: 'table-editor',
  templateUrl: './table-editor.component.html'
})

export class TableEditorComponent {
  readonly columnTypes = ColumnType.ALL_TYPES;

  readonly table: Table = Table.createDefault("Table 1");
  tableSQL: string = "";

  add(): void {
    this.table.columns.push(new Column("", ColumnType.STRING, false, false));
  }

  changeType(col: Column, typeId: number): void {
    col.type = ColumnType.getById(typeId);
  }

  save(): void {
    this.tableSQL = 'CEATE TABLE "' + this.table.name + '" (';
    let b = false;
    for (let col of this.table.columns) {
      if (b)
        this.tableSQL += ", ";

      this.tableSQL += '"' + col.sqlName + '" ';
      if (col.key)
        this.tableSQL += "PRIMARY KEY ";

      this.tableSQL += col.type.sqlName;

      b = true;
    }
    this.tableSQL += ");";
  }
}
