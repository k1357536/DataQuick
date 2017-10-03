import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { TableProposal, Table, Column, ColumnType, ColumnTypes } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

interface TableEx extends Table {
  rows: number;
}

@Component({
  templateUrl: './table-list.component.html'
})

export class TableListComponent implements OnInit {
  tables: TableEx[];
  newName: string;
  errorMsg: string = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService) { }

  async ngOnInit(): Promise<void> {
    try {
      await this.getTables();
    } catch (e) {
      this.errorMsg = e;
    }
  }

  onSelect(id: string): void {
    this.router.navigate(['/manager/editor', id]);
  }

  async add(): Promise<void> {
    try {
      await this.metadataService.addTable(this.newName);
      await this.getTables();
      this.newName = "";
    }
    catch (e) {
      this.errorMsg = e;
    }
  }

  async delete(tbl: Table): Promise<void> {
    try {
      await this.metadataService.deleteTable(tbl);
      await this.getTables();
    }
    catch (e) {
      this.errorMsg = e;
    }
  }

  trackById(index: number, table: Table): number {
    return index; // TODO
  }

  private async getTables(): Promise<void> {
    this.tables = await this.metadataService.getTables() as TableEx[];
    this.tables.forEach(async tbl => {
      const rows = await this.dataService.countRows(tbl);
      tbl.rows = rows;
    });
  }
}
