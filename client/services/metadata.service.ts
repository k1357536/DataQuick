import { Injectable, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { UUID, Table, Folder, TableProposal, FolderProposal } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';

import { DataCache } from './data-cache';

@Injectable()
export class MetadataService extends DataCache<string, Table> implements OnDestroy {
  private readonly url = 'api/metadata/';
  private readonly folderUrl = this.url + 'folders/';

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnDestroy() {
    super.stopTimer();
  }

  // === Folders ===============================================================

  getFolders(): Promise<Folder[]> {
    return this.httpClient.get<Folder[]>(this.folderUrl).toPromise();
  }

  addFolder(name: string, parent: Folder): Promise<void> {
    if (!parent)
      parent = Folders.getRoot();
    const p: FolderProposal = { name, parent: parent.id };
    return this.httpClient.post(this.folderUrl, p).toPromise().then(_ => super.clearCaches());
  }

  importFolder(p: Folder): Promise<void> {
    return this.httpClient.post(this.folderUrl, p).toPromise().then(_ => super.clearCaches());
  }

  deleteAllFolders(): Promise<void> {
    return this.httpClient.delete(this.folderUrl + 'all').toPromise().then(_ => super.clearCaches());
  }

  deleteFolder(f: Folder): Promise<void> {
    return this.httpClient.delete(this.folderUrl + f.id).toPromise().then(_ => super.clearCaches());
  }

  // === Tables ================================================================

  getTable(uuid: UUID): Promise<Table> {
    return super.getCache(uuid, () => this.httpClient.get<Table>(this.url + uuid).toPromise());
  }

  getTables(): Promise<Table[]> {
    const p = this.httpClient.get<Table[]>(this.url).toPromise();
    super.addAllCache(p, t => t.id);
    return p;
  }

  addTable(name: string, parent: Folder): Promise<void> {
    const p: TableProposal = { name, parent: parent.id };
    return this.httpClient.post(this.url, p).toPromise().then(_ => super.clearCaches());
  }

  importTable(tbl: Table): Promise<void> {
    return this.httpClient.post(this.url, tbl).toPromise().then(_ => super.clearCaches());
  }

  updateTable(table: Table): Promise<void> {
    return this.httpClient.put(this.url + table.id, table).toPromise().then(_ => super.clearCaches());
  }

  deleteAllTables(): Promise<void> {
    return this.httpClient.delete(this.url + 'all').toPromise().then(_ => super.clearCaches());
  }

  deleteTable(table: Table): Promise<void> {
    return this.httpClient.delete(this.url + table.id).toPromise().then(_ => super.clearCaches());
  }
}
