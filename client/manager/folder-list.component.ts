import { Component, OnInit } from '@angular/core';

import { Folder } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { ErrorHandling, getPath } from '../services/utils';

@Component({
  templateUrl: './folder-list.component.html'
})

export class FolderListComponent extends ErrorHandling implements OnInit {
  folders: Folder[];
  newName: string = "";

  constructor(
    private metadataService: MetadataService) { super(); }

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

  async delete(folder: Folder, event: Event): Promise<void> {
    event.stopPropagation();
    try {
      await this.metadataService.deleteFolder(folder)
        .catch(e => this.handleError(e));
      await this.getFolders();
    }
    catch (e) {
      this.handleError(e);
    }
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
