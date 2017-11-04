import { Injectable, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { UUID, Row } from '../../shared/metadata.model';

import { DataCache } from './data-cache';

@Injectable()
export class DataService extends DataCache<string, Row> implements OnDestroy {
  private readonly url = 'api/data/';

  constructor(private httpClient: HttpClient) {
    super();
  }

  ngOnDestroy() {
    super.stopTimer();
  }

  countRows(tableId: UUID): Promise<number> {
    return this.httpClient.get(this.url + 'count/' + tableId, { responseType: 'text' })
      .toPromise()
      .then(result => Number(result));
  }

  getAll(tableId: UUID, sortby: string | null, sortASC: boolean, page: number, pageSize: number): Promise<Row[]> {
    let url = this.url + tableId;
    if (sortby)
      url += `?sortby=${sortby}&sortASC=${sortASC}`;
    if (!Number.isNaN(page) && !Number.isNaN(pageSize))
      url += (sortby ? '&' : '?') + `page=${page}&pageSize=${pageSize}`;

    const p = this.httpClient.get<Row[]>(url).toPromise();
    super.addAllCache(p, r => tableId + '/' + r.id);
    return p;
  }

  get(tableId: UUID, entryId: number): Promise<Row> {
    const key = tableId + '/' + entryId;
    return super.getCache(key, () => this.httpClient.get<Row>(this.url + tableId + "/" + entryId).toPromise());
  }

  update(tableId: UUID, entry: Row): Promise<void> {
    return this.httpClient.put(this.url + tableId, entry, { responseType: 'text' }).toPromise().then(_ => super.clearCaches());
  }

  add(tableId: UUID, entry: any): Promise<void> {
    return this.httpClient.post(this.url + tableId, entry, { responseType: 'text' }).toPromise().then(_ => super.clearCaches());
  }

  delete(tableId: UUID, entry: Row): Promise<void> {
    return this.httpClient.delete(this.url + tableId + '/' + entry.id, { responseType: 'text' }).toPromise().then(_ => super.clearCaches());
  }
}
