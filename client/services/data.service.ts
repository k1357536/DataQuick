import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Table } from '../../shared/metadata.model';

@Injectable()
export class DataService {
  private readonly url = 'api/data/';

  constructor(private http: Http) { }

  async countRows(table: Table): Promise<number> {
    const response = await this.http.get(this.url + 'count/' + table.id).toPromise();
    if (response.status != 200)
      throw response;
    return Number(response.text());
  }

  async getAll(table: Table): Promise<{ id: number }[]> {
    const response = await this.http.get(this.url + table.id).toPromise();
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
}
