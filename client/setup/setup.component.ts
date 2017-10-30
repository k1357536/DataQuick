import { Component, OnInit } from '@angular/core';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType } from '../../shared/metadata.model';
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
      tbl.columns.push(Columns.create("Name", ColumnType.STRING));
      tbl.columns.push(Columns.create("Age", ColumnType.NUMBER));
      tbl.columns.push(Columns.create("Date of Birth", ColumnType.DATE));
      tbl.columns.push(Columns.create("Executive", ColumnType.BOOL));
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
        name: "Michael",
        age: 23,
        date_of_birth: new Date(),
        executive: true
      };
      this.dataService.add(tbl.id, data);
      for (let i = 1; i < 20; i++) {
        data.name += "1";
        data.age += 1;
        data.executive = !data.executive;
        await this.dataService.add(tbl.id, data);
      }

      this.msg = "Insert successful!";
    } catch (e) {
      this.msg = e;
    }
  }
}
