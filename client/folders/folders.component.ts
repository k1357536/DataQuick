import { Component, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { UUID, Table, Folder } from '../../shared/metadata.model';
import { Folders, UUIDs } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';
import { ErrorHandling, getPath } from '../services/utils';

@Component({
  templateUrl: './folders.component.html',
})

export class FoldersComponent extends ErrorHandling {
  @Input() currentId: UUID;
  @Input() current: Folder;
  parent: Folder | null;

  children: (Folder | Table)[];
  folders: Folder[];

  constructor(
    private metadataService: MetadataService,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  async ngOnInit(): Promise<void> {
    this.routeParam
      .observeParamNullable(this.route, 'folder', UUIDs.check)
      .subscribe(async (fid) => {
        if (fid == null)
          this.currentId = Folders.getRoot().id;
        else
          this.currentId = fid;

        this.folders = await this.getFolders();

        this.current = this.folders.find(f => f.id === this.currentId) as Folder;

        const root = Folders.getRoot();
        if (!this.current || this.current.id === root.id) {
          this.current = root;
          this.parent = null;
        } else if (this.current.parent === root.id) {
          this.parent = root;
        } else {
          const res = this.folders.find(f => f.id === this.current.parent);
          this.parent = res ? res : null;
        }

        const tables = await this.getTables(this.current);
        const folders = this.folders.filter(f => f.parent === this.current.id);

        this.children = folders.concat(tables);
      }, e => this.handleError(e));
  }

  path(tbl: Table) {
    if (this.folders)
      return getPath(tbl, this.folders);
    else
      return '';
  }

  private async getTables(folder: Folder): Promise<Table[]> {
    try {
      return await this.metadataService.getTables(folder);
    } catch (e) {
      this.handleError(e);
      return [];
    }
  }

  private async getFolders(): Promise<Folder[]> {
    try {
      return await this.metadataService.getFolders();
    } catch (e) {
      this.handleError(e);
      return [];
    }
  }
}
