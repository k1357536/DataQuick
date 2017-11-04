import { Component, OnInit, Input } from '@angular/core';

import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';
import { RouteParamService } from '../services/route-param.service';

import { UUID, ColumnType, Row } from '../../shared/metadata.model';
import { UUIDs } from '../../shared/metadata.utils';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { TableEx, exTable } from './utils';

@Component({
  templateUrl: './entry-editor.component.html'
})
export class EntryEditorComponent implements OnInit {
  @Input() table: TableEx;
  @Input() entry: Row;
  errorMsg: string | null = null;
  ColumnType = ColumnType; // for view

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { }

  private handleError(e: any): void {
    console.error(e);
    if (e.message && typeof e.message === 'string')
      this.errorMsg = e.message;
    else
      this.errorMsg = JSON.stringify(e);
  }

  ngOnInit(): void {
    const tID = this.routeParam.observeParam(this.route, 'table', UUIDs.check);
    const eID = this.routeParam.observeParam(this.route, 'entry', e => Number(e) != NaN ? Number(e) : null);

    tID.subscribe(tid => this.loadMetadata(tid), e => this.handleError(e));
    Observable.zip(tID, eID).subscribe(([tid, eid]) => this.loadData(tid, eid), e => this.handleError(e));
  }

  async loadMetadata(id: UUID): Promise<void> {
    return await this.metadataService.getTable(id)
      .then(t => { this.table = exTable(t); })
      .catch(e => this.handleError(e));
  }

  async loadData(tableId: UUID, entryId: number): Promise<void> {
    return await this.dataService.get(tableId, entryId)
      .then(d => { this.entry = d; })
      .catch(e => this.handleError(e));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.entry.id) {
      this.dataService.update(this.table.id, this.entry)
        .then(() => this.goBack())
        .catch(e => this.handleError(e));
    } else {
      this.dataService.add(this.table.id, this.entry)
        .then(() => this.goBack())
        .catch(e => this.handleError(e));
    }
  }
}
