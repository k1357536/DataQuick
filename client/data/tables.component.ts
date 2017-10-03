import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { TableProposal, Table, Column, ColumnType, ColumnTypes } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

interface TableEx extends Table {
  rows: number;
}

@Component({
  templateUrl: './tables.component.html'
})

export class TablesComponent implements OnInit {
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
    this.router.navigate(['/data/table', id]);
  }

  private async getTables(): Promise<void> {
    this.tables = await this.metadataService.getTables() as TableEx[];
    this.tables.forEach(async tbl => {
      const rows = await this.dataService.countRows(tbl);
      tbl.rows = rows;
    });
  }
}
