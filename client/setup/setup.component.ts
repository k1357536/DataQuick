import { Component } from '@angular/core';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';
import { ErrorHandling } from '../services/utils';

import { exportStructure, importStructure } from './importExport';
import { create, insert } from './testData';

@Component({
  templateUrl: './setup.component.html',
})

export class SetupComponent extends ErrorHandling {
  constructor(
    private dataService: DataService,
    private metadataService: MetadataService) { super(); }

  async clear() {
    this.errorMsg = '';
    try {
      const tables = await this.metadataService.getTables();
      await this.metadataService.deleteAllTables();

      const folders = await this.metadataService.getFolders();
      await this.metadataService.deleteAllFolders();

      this.handleError(`Deleted ${folders.length} folders and ${tables.length} tables!`);
    } catch (e) {
      this.handleError(e);
    }
  }

  async create() {
    this.errorMsg = '';
    try {
      this.handleError(await create(this.metadataService));
    } catch (e) {
      this.handleError(e);
    }
  }

  async insert() {
    this.errorMsg = '';
    try {
      this.handleError(await insert(this.metadataService, this.dataService));
    } catch (e) {
      this.handleError(e);
    }
  }

  async exportStructure(): Promise<void> {
    this.errorMsg = '';
    try {
      this.handleError(await exportStructure(this.metadataService));
    } catch (e) {
      this.handleError(e);
    }
  }

  importStructure(): void {
    this.errorMsg = '';
    try {
      importStructure(this.metadataService, (e: any) => this.handleError(e));
    } catch (e) {
      this.handleError(e);
    }
  }

  exportData(): void {
    this.errorMsg = '';
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
    this.errorMsg = '';
    try {
      this.handleError('Not implemented yet!'); // TODO
    } catch (e) {
      this.handleError(e);
    }
  }
}
