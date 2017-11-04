import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Table } from '../../shared/metadata.model';
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
  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService) { }

  private handleError(e: any): void {
    console.error(e);
    if (e instanceof Error)
      this.errorMsg += e.message;
    else
      this.errorMsg = JSON.stringify(e);
  }

  async ngOnInit(): Promise<void> {
    await this.getTables();
  }

  onSelect(id: string): void {
    this.router.navigate(['/data', id]);
  }

  private async getTables(): Promise<void> {
    try {
      this.tables = await this.metadataService.getTables() as TableEx[];
      this.tables.forEach(async tbl => {
        const rows = await this.dataService.countRows(tbl.id);
        tbl.rows = rows;
      });
    } catch (e) {
      this.handleError(e);
    }
  }
}
