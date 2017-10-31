import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Table } from '../../shared/metadata.model';

@Injectable()
export class DataService {
  private readonly url = 'api/data/';
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private http: Http) { }

  async countRows(tableId: string): Promise<number> {
    const response = await this.http.get(this.url + 'count/' + tableId).toPromise();
    if (response.status != 200)
      throw response;
    return Number(response.text());
  }

  async getAll(tableId: string, sortby: string, page: number, pageSize: number): Promise<{ id: number }[]> {
    let url = this.url + tableId;
    if (sortby)
      url += `?sortby=${sortby}`;
    if (!Number.isNaN(page) && !Number.isNaN(pageSize))
      url += (sortby ? '&' : '?') + `page=${page}&pageSize=${pageSize}`;

    const response = await this.http.get(url).toPromise();
    if (response.status != 200)
      throw response;
    return response.json();
  }

  async get(tableId: string, entryId: number): Promise<{ id: number }> {
    const response = await this.http.get(this.url + tableId + "/" + entryId).toPromise();
    if (response.status != 200)
      throw response;
    return response.json();
  }

  async update(tableId: string, entry: { id: number }): Promise<void> {
    await this.http.put(this.url + tableId, JSON.stringify(entry), { headers: this.headers }).toPromise();
  }

  async add(tableId: string, entry: any): Promise<void> {
    await this.http.post(this.url + tableId, JSON.stringify(entry), { headers: this.headers }).toPromise();
  }

  async delete(tableId: string, entry: { id: number }): Promise<void> {
    await this.http.delete(this.url + tableId + '/' + entry.id, { headers: this.headers }).toPromise();
  }
}
