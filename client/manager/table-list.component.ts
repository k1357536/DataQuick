import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { TableProposal, Table, Column, ColumnType } from '../../shared/metadata.model';
import { ColumnTypes } from '../../shared/metadata.utils';
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
  newName: string = "";
  errorMsg: string = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService) { }

  private handleError(e: any): void {
    this.errorMsg = e._body ? e + ' ' + e._body : e;
    console.error(e);
  }

  async ngOnInit(): Promise<void> {
    await this.getTables();
  }

  onSelect(id: string): void {
    this.router.navigate(['/manager', id]);
  }

  async add(): Promise<void> {
    if (!this.newName || this.newName.length <= 0)
      this.errorMsg = "No table name specified!";
    else {
      await this.metadataService.addTable(this.newName)
        .then(() => this.errorMsg = "")
        .catch(e => {
          if (e.status && e.status === 409)
            this.errorMsg = "Table name already exists!";
          else
            this.handleError(e);
        });
      this.newName = "";
      await this.getTables();
    }
  }

  async delete(tbl: Table): Promise<void> {
    await this.metadataService.deleteTable(tbl)
      .catch(e => this.handleError(e));
    await this.getTables();
  }

  trackById(index: number, table: Table): number {
    return index; // TODO
  }

  private async getTables(): Promise<void> {
    try {
      this.tables = await this.metadataService.getTables() as TableEx[];
      this.tables.forEach(async tbl => {
        const rows = await this.dataService.countRows(tbl.id);
        tbl.rows = rows;
      });
    }
    catch (e) {
      this.handleError(e);
    }
  }
}
