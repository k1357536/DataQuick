import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Table, Folder, TableProposal, FolderProposal } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';

@Injectable()
export class MetadataService {
  private readonly url = 'api/metadata/';
  private readonly folderUrl = this.url + 'folders/';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  // === Folders ===============================================================

  async getFolders(): Promise<Folder[]> {
    const response = await this.http.get(this.folderUrl).toPromise();
    return response.json() as Folder[];
  }

  async addFolder(name: string, parent: Folder): Promise<void> {
    if (!parent)
      parent = Folders.getRoot();
    const p: FolderProposal = { name, parent: parent.id };
    await this.http.post(this.folderUrl, JSON.stringify(p), { headers: this.headers }).toPromise();
  }

  async importFolder(p: Folder): Promise<void> {
    await this.http.post(this.folderUrl, JSON.stringify(p), { headers: this.headers }).toPromise();
  }

  async deleteAllFolders(): Promise<void> {
    await this.http.delete(this.folderUrl + 'all').toPromise();
  }

  async deleteFolder(f: Folder): Promise<void> {
    await this.http.delete(this.folderUrl + f.id).toPromise();
  }

  // === Tables ================================================================

  async getTable(uuid: string): Promise<Table> {
    const response = await this.http.get(this.url + uuid).toPromise();
    return response.json() as Table;
  }

  async getTableName(uuid: string): Promise<string> {
    return (await this.getTable(uuid)).name;
  }

  async getTables(): Promise<Table[]> {
    const response = await this.http.get(this.url).toPromise();
    return response.json() as Table[];
  }

  async addTable(name: string, parent: Folder): Promise<void> {
    const p: TableProposal = { name, parent: parent.id };
    await this.http.post(this.url, JSON.stringify(p), { headers: this.headers }).toPromise();
  }

  async importTable(tbl: Table): Promise<void> {
    await this.http.post(this.url, JSON.stringify(tbl), { headers: this.headers }).toPromise();
  }

  async updateTable(table: Table): Promise<void> {
    await this.http.put(this.url + table.id, JSON.stringify(table), { headers: this.headers }).toPromise();
  }

  async deleteAllTables(): Promise<void> {
    await this.http.delete(this.url + 'all').toPromise();
  }

  async deleteTable(table: Table): Promise<void> {
    await this.http.delete(this.url + table.id).toPromise();
  }
}
