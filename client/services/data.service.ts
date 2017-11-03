import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Row } from '../../shared/metadata.model';

@Injectable()
export class DataService {
  private readonly url = 'api/data/';

  constructor(private httpClient: HttpClient) { }

  countRows(tableId: string): Promise<number> {
    return this.httpClient.get(this.url + 'count/' + tableId, { responseType: 'text' })
      .toPromise()
      .then(result => Number(result));
  }

  getAll(tableId: string, sortby: string | null, sortASC: boolean, page: number, pageSize: number): Promise<Row[]> {
    let url = this.url + tableId;
    if (sortby)
      url += `?sortby=${sortby}&sortASC=${sortASC}`;
    if (!Number.isNaN(page) && !Number.isNaN(pageSize))
      url += (sortby ? '&' : '?') + `page=${page}&pageSize=${pageSize}`;

    return this.httpClient.get<Row[]>(url).toPromise();
  }

  get(tableId: string, entryId: number): Promise<Row> {
    return this.httpClient.get<Row>(this.url + tableId + "/" + entryId).toPromise();
  }

  update(tableId: string, entry: Row): Promise<void> {
    return this.httpClient.put(this.url + tableId, entry).toPromise().then(_ => { });
  }

  add(tableId: string, entry: any): Promise<void> {
    return this.httpClient.post(this.url + tableId, entry).toPromise().then(_ => { });
  }

  delete(tableId: string, entry: Row): Promise<void> {
    return this.httpClient.delete(this.url + tableId + '/' + entry.id).toPromise().then(_ => { });
  }
}
