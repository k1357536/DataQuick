import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { UUID, Table, Folder, TableProposal, FolderProposal } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';

@Injectable()
export class MetadataService {
  private readonly url = 'api/metadata/';
  private readonly folderUrl = this.url + 'folders/';

  constructor(private httpClient: HttpClient) { }

  // === Folders ===============================================================

  getFolders(): Promise<Folder[]> {
    return this.httpClient.get<Folder[]>(this.folderUrl).toPromise();
  }

  addFolder(name: string, parent: Folder): Promise<void> {
    if (!parent)
      parent = Folders.getRoot();
    const p: FolderProposal = { name, parent: parent.id };
    return this.httpClient.post(this.folderUrl, p).toPromise().then(_ => { });
  }

  importFolder(p: Folder): Promise<void> {
    return this.httpClient.post(this.folderUrl, p).toPromise().then(_ => { });
  }

  deleteAllFolders(): Promise<void> {
    return this.httpClient.delete(this.folderUrl + 'all').toPromise().then(_ => { });
  }

  deleteFolder(f: Folder): Promise<void> {
    return this.httpClient.delete(this.folderUrl + f.id).toPromise().then(_ => { });
  }

  // === Tables ================================================================

  getTable(uuid: UUID): Promise<Table> {
    return this.httpClient.get<Table>(this.url + uuid).toPromise();
  }

  getTables(): Promise<Table[]> {
    return this.httpClient.get<Table[]>(this.url).toPromise();
  }

  addTable(name: string, parent: Folder): Promise<void> {
    const p: TableProposal = { name, parent: parent.id };
    return this.httpClient.post(this.url, p).toPromise().then(_ => { });
  }

  importTable(tbl: Table): Promise<void> {
    return this.httpClient.post(this.url, tbl).toPromise().then(_ => { });
  }

  updateTable(table: Table): Promise<void> {
    return this.httpClient.put(this.url + table.id, table).toPromise().then(_ => { });
  }

  deleteAllTables(): Promise<void> {
    return this.httpClient.delete(this.url + 'all').toPromise().then(_ => { });
  }

  deleteTable(table: Table): Promise<void> {
    return this.httpClient.delete(this.url + table.id).toPromise().then(_ => { });
  }
}
