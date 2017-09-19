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

  getTable(uuid: string): Promise<Table> {
    return this.http.get(this.url + uuid)
      .toPromise()
      .then(response => response.json() as Table)
      .catch(this.handleError);
  }

  getTables(): Promise<Table[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as Table[])
      .catch(this.handleError);
  }

  addTable(p: TableProposal): Promise<Table> {
    return this.http.post(this.url,
      JSON.stringify(p),
      { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Table)
      .catch(this.handleError);
  }

  updateTable(table: Table): Promise<Table> {
    return this.http.put(this.url + table.id,
      JSON.stringify(table),
      { headers: this.headers })
      .toPromise()
      .then(response => response.json() as Table)
      .catch(this.handleError);
  }

  deleteTable(table: Table): Promise<any> {
    return this.http.delete(this.url + table.id)
      .toPromise()
      .then(response => null)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
