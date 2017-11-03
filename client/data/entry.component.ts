import { Component, OnInit, Input } from '@angular/core';

import { Location } from '@angular/common';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType, Row } from '../../shared/metadata.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { TableEx, exTable } from './utils';

@Component({
  templateUrl: './entry.component.html'
})
export class EntryComponent implements OnInit {
  @Input() table: TableEx;
  @Input() entry: Row;
  errorMsg: string | null = null;
  ColumnType = ColumnType; // for view

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute) { }

  private handleError(e: any): void {
    this.errorMsg = e._body ? e + ' ' + e._body : e;
    console.error(e);
  }

  ngOnInit(): void {
    let tableId = this.route.paramMap.switchMap((params: ParamMap) => Observable.of(params.get('table')));
    let entryId = this.route.paramMap.switchMap((params: ParamMap) => Observable.of(params.get('entry')));

    tableId.subscribe(
      tid => { if (tid) this.loadMetadata(tid); },
      e => this.handleError(e));

    (Observable.zip(tableId, entryId)
      .filter(([tid, eid]) => tid && eid ? true : false) as Observable<[string, string]>)
      .subscribe(([tid, eid]) => this.loadData(tid, Number(eid)),
      e => this.handleError(e));
  }

  async loadMetadata(id: string): Promise<void> {
    return await this.metadataService.getTable(id)
      .then(t => { this.table = exTable(t); })
      .catch(e => this.handleError(e));
  }

  async loadData(tableId: string, entryId: number): Promise<void> {
    return await this.dataService.get(tableId, entryId)
      .then(d => { this.entry = d; })
      .catch(e => this.handleError(e));
  }

  goBack(): void {
    this.location.back();
  }

  edit(): void {
    this.router.navigate(["/data", this.table.id, this.entry.id, "edit"]);
  }

  async delete(): Promise<void> {
    await this.dataService.delete(this.table.id, this.entry)
      .then(() => this.location.back())
      .catch(e => this.handleError(e));
  }
}
