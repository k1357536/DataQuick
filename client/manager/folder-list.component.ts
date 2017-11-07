import { Component, OnInit } from '@angular/core';

import { Folder } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';
import { MetadataService } from '../services/metadata.service';

import { getPath } from '../data/utils';

@Component({
  templateUrl: './folder-list.component.html'
})

export class FolderListComponent implements OnInit {
  folders: Folder[];
  newName: string = "";

  errorMsg: string | null = null;

  constructor(
    private metadataService: MetadataService) { }

  private handleError(e: any): void {
    console.error(e);
    if (e.message && typeof e.message === 'string')
      this.errorMsg = e.message;
    else
      this.errorMsg = JSON.stringify(e);
  }

  async ngOnInit(): Promise<void> {
    await this.getFolders();
  }

  path(obj: Folder): string {
    if (this.folders)
      return getPath(obj, this.folders);
    else
      return '';
  }

  async add(): Promise<void> {
    if (!this.newName || this.newName.length <= 0)
      this.errorMsg = "No table name specified!";
    else {
      await this.metadataService.addFolder(this.newName, Folders.getRoot())
        .then(() => this.errorMsg = "")
        .catch(e => {
          this.handleError(e);
        });
      this.newName = "";
      await this.getFolders();
    }
  }

  async delete(_folder: Folder): Promise<void> {
    // await this.metadataService.deleteTable(tbl)
    //   .catch(e => this.handleError(e));
    // await this.getTables();
    this.errorMsg = 'Not implemented yet!'; // TODO
  }

  private async getFolders(): Promise<void> {
    try {
      this.folders = await this.metadataService.getFolders();
    }
    catch (e) {
      this.handleError(e);
    }
  }
}
