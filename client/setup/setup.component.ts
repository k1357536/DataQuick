import { Component, OnInit } from '@angular/core';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType, StringConstraint, NumberConstraint, DateConstraint } from '../../shared/metadata.model';
import { Columns, Constraints } from '../../shared/metadata.utils';

@Component({
  templateUrl: './setup.component.html',
})

export class SetupComponent implements OnInit {
  msg = "";

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService) { }

  ngOnInit(): void {
  }

  async clear() {
    this.msg = "";
    try {
      const tables = await this.metadataService.getTables();

      for (const tbl of tables) {
        await this.metadataService.deleteTable(tbl);
      }

      this.msg = "Deleted " + tables.length + " tables!";
    } catch (e) {
      this.msg = e;
    }
  }

  async create() {
    this.msg = "";
    try {
      await this.metadataService.addTable("Employees");

      const tbl = (await this.metadataService.getTables()).filter(tbl => tbl.name === "Employees")[0];

      const name = Columns.create("Name", ColumnType.STRING);
      const age = Columns.create("Age", ColumnType.NUMBER);
      const birthday = Columns.create("Date of Birth", ColumnType.DATE);
      const exec = Columns.create("Executive", ColumnType.BOOL);
      const comment = Columns.create("Comment", ColumnType.STRING);

      name.constraint = { notNull: true, unique: true, maxLength: 30, regExp: '^[a-zA-Z0-9 ]*$' } as StringConstraint;
      age.constraint = { notNull: true, unique: false, min: 1, max: 120 } as NumberConstraint;
      birthday.constraint = { notNull: false, unique: false, min: new Date(1900, 1, 1), max: new Date(2018, 1, 1) } as DateConstraint;
      exec.constraint = { notNull: true, unique: false };
      comment.constraint = { notNull: false, unique: false };

      tbl.columns.push(name);
      tbl.columns.push(age);
      tbl.columns.push(birthday);
      tbl.columns.push(exec);
      tbl.columns.push(comment);
      await this.metadataService.updateTable(tbl);

      this.msg = "Create successful!";
    } catch (e) {
      this.msg = e;
    }
  }

  async insert() {
    this.msg = "";
    try {
      const tbl = (await this.metadataService.getTables()).filter(tbl => tbl.name === "Employees")[0];

      const data = {
        name: '',
        age: 0,
        date_of_birth: new Date(),
        executive: true
      };
      for (let i = 0; i < 20; i++) {
        data.name = 'Michael ' + String.fromCharCode(20 * Math.random() + 'a'.charCodeAt(0)) + i;
        data.age = Math.floor(50 * Math.random()) + 20;
        data.executive = !data.executive;
        await this.dataService.add(tbl.id, data);
      }

      this.msg = "Insert successful!";
    } catch (e) {
      this.msg = e;
      if (e._body)
        this.msg += ' ' + e._body;
    }
  }
}
