import { Component } from '@angular/core';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { exportStructure, importStructure } from './importExport';
import { create, insert } from './testData';

@Component({
  templateUrl: './setup.component.html',
})

export class SetupComponent {
  msg = '';

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService) { }

  private handleError(e: any) {
    console.error(e);
    if (e.message && typeof e.message === 'string')
      this.msg += e.message;
    else
      this.msg = JSON.stringify(e);
  }

  async clear() {
    this.msg = '';
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
    this.msg = '';
    try {
      this.msg = await create(this.metadataService);
    } catch (e) {
      this.handleError(e);
    }
  }

  async insert() {
    this.msg = '';
    try {
      this.msg = await insert(this.metadataService, this.dataService);
    } catch (e) {
      this.handleError(e);
    }
  }

  async exportStructure(): Promise<void> {
    this.msg = '';
    try {
      this.msg = await exportStructure(this.metadataService);
    } catch (e) {
      this.handleError(e);
    }
  }

  importStructure(): void {
    this.msg = '';
    try {
      importStructure(this.metadataService, (e: any) => this.handleError(e));
    } catch (e) {
      this.handleError(e);
    }
  }

  exportData(): void {
    this.msg = '';
    try {
      const a = document.createElement('a');
      a.href = '/api/data/export/';
      a.download = 'data.json';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      this.handleError(e);
    }
  }

  importData(): void {
    this.msg = '';
    try {
      this.msg = 'Not implemented yet!'; // TODO
    } catch (e) {
      this.handleError(e);
    }
  }
}
