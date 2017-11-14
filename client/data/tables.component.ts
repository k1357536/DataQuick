import { Component, OnInit } from '@angular/core';

import { Table, Folder } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';
import { ErrorHandling, getPath } from '../services/utils';

@Component({
  templateUrl: './tables.component.html'
})

export class TablesComponent extends ErrorHandling implements OnInit {
  tables: (Table & { rows: number })[];
  folders: Folder[];
  newName: string;

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService) { super(); }

  async ngOnInit(): Promise<void> {
    await this.getFolders();
    await this.getTables();
  }

  path(tbl: Table) {
    if (this.folders)
      return getPath(tbl, this.folders);
    else
      return '';
  }

  private async getTables(): Promise<void> {
    try {
      this.tables = (await this.metadataService.getTables() as (Table & { rows: number })[])
        .sort((t1, t2) => (this.path(t1) + t1.name).localeCompare(this.path(t2) + t2.name));
      this.tables.forEach(async tbl => {
        const rows = await this.dataService.countRows(tbl.id);
        tbl.rows = rows;
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  private async getFolders(): Promise<void> {
    try {
      this.folders = await this.metadataService.getFolders();
    } catch (e) {
      this.handleError(e);
    }
  }
}
