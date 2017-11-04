import { Component, OnInit } from '@angular/core';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType, StringConstraint, NumberConstraint, DateConstraint, FKConstraint } from '../../shared/metadata.model';
import { Columns, Folders } from '../../shared/metadata.utils';

interface TestData {
  age: number,
  name: string,
  date_of_birth: Date,
  executive: boolean,
  image: Buffer | null,
  salary: number,
  liter: number,
  completeness: number,
  ref: number
};

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

  private handleError(e: any) {
    console.error(e);
    if (e instanceof Error)
      this.msg += e.message;
    else
      this.msg = JSON.stringify(e);
  }

  async clear() {
    this.msg = "";
    try {
      const tables = await this.metadataService.getTables();
      await this.metadataService.deleteAllTables();

      const folders = await this.metadataService.getFolders();
      await this.metadataService.deleteAllFolders();

      this.msg = `Deleted ${folders.length} folders and ${tables.length} tables!`;
    } catch (e) {
      this.handleError(e);
    }
  }

  async create() {
    this.msg = "";
    try {
      await this.metadataService.addFolder("Test Folder", Folders.getRoot());

      const f = (await this.metadataService.getFolders()).find(f => f.name === "Test Folder");

      if (f == null)
        throw new Error('Error getting folder!');

      await this.metadataService.addTable("Test", f);

      const tbl = (await this.metadataService.getTables()).find(tbl => tbl.name === "Test");

      if (tbl == null)
        throw new Error('Error getting table!');

      tbl.columns[0].inSummary = false;

      tbl.columns.push(Columns.create("Age", ColumnType.INT,
        {
          notNull: true,
          unique: false,
          min: 1,
          max: 120
        } as NumberConstraint));

      tbl.columns.push(Columns.create("Name", ColumnType.STRING,
        {
          notNull: true,
          unique: true,
          maxLength: 30,
          regExp: '^[a-zA-Z0-9 ]*$'
        } as StringConstraint,
        true));

      tbl.columns.push(Columns.create("Date of Birth", ColumnType.DATE,
        {
          notNull: false,
          unique: false,
          min: new Date(1900, 1, 1),
          max: new Date(2018, 1, 1)
        } as DateConstraint));

      tbl.columns.push(Columns.create("Executive", ColumnType.BOOL,
        {
          notNull: true,
          unique: false
        }));

      tbl.columns.push(Columns.create("Image", ColumnType.IMAGE,
        {
          notNull: false,
          unique: false
        }));

      tbl.columns.push(Columns.create("Salary", ColumnType.MONEY,
        {
          notNull: true,
          unique: false,
          min: 100,
          max: 1000000
        } as NumberConstraint));

      tbl.columns.push(Columns.create("Liter", ColumnType.REAL,
        {
          notNull: true,
          unique: false,
          min: 0.5,
          max: 3.5
        } as NumberConstraint));

      tbl.columns.push(Columns.create("Completeness", ColumnType.PERCENT,
        {
          notNull: true,
          unique: false,
          min: 0,
          max: 2
        } as NumberConstraint));

      tbl.columns.push(Columns.create("Ref", ColumnType.FK,
        {
          notNull: true,
          unique: false,
          target: tbl.id
        } as FKConstraint));

      await this.metadataService.updateTable(tbl);

      this.msg = "Create successful!";
    } catch (e) {
      this.handleError(e);
    }
  }

  async insert() {
    this.msg = "";
    try {
      const tbl = (await this.metadataService.getTables()).find(tbl => tbl.name === "Test");

      if (tbl == null)
        throw new Error('Error getting table!');

      for (let i = 0; i < 20; i++) {
        const data: TestData = {
          name: 'Michael ' + String.fromCharCode(20 * Math.random() + 'a'.charCodeAt(0)) + i,
          age: Math.floor(50 * Math.random()) + 20,
          date_of_birth: new Date(),
          executive: Math.random() > 0.3,
          image: null,
          salary: Math.random() * 5000 + 1000,
          liter: Math.random() * 2 + 1,
          completeness: Math.random(),
          ref: Math.min(Math.floor(Math.random() * (i + 1)) + 1, i + 1)
        };
        await this.dataService.add(tbl.id, data);
      }

      this.msg = "Insert successful!";
    } catch (e) {
      this.handleError(e);
    }
  }
}
