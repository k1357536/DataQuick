import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Table, TableProposal } from '../../shared/metadata.model';

@Injectable()
export class MetadataService {
  private readonly url = 'api/metadata/';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  /*searchTable(term: string): Observable<Table[]> {
    return this.http
      .get(this.url + `?name=${term}`)
      .map(response => response.json().data as Table[]);
  }*/

  async getTable(uuid: string): Promise<Table> {
    const response = await this.http.get(this.url + uuid).toPromise();
    return response.json() as Table;
  }

  async getTables(): Promise<Table[]> {
    const response = await this.http.get(this.url).toPromise();
    return response.json() as Table[];
  }

  async addTable(name: string): Promise<void> {
    const p: TableProposal = { name };
    await this.http.post(this.url, JSON.stringify(p), { headers: this.headers }).toPromise();
  }

  async updateTable(table: Table): Promise<void> {
    await this.http.put(this.url + table.id, JSON.stringify(table), { headers: this.headers }).toPromise();
  }

  async deleteTable(table: Table): Promise<void> {
    await this.http.delete(this.url + table.id).toPromise();
  }
}
