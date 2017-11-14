import { Component, OnInit, Input } from '@angular/core';

import { Location } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';
import { RouteParamService } from '../services/route-param.service';
import { ErrorHandling } from '../services/utils';

import { UUID, Row } from '../../shared/metadata.model';
import { UUIDs, Columns } from '../../shared/metadata.utils';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { TableEx, exTable } from './utils';

type Dependency = { tbl: TableEx, col: string, data: Row[], displayData: Row[] };

@Component({
  templateUrl: './entry.component.html'
})
export class EntryComponent extends ErrorHandling implements OnInit {
  readonly entriesPerPage = 5;

  @Input() table: TableEx;
  @Input() entry: Row;


  dependents: Dependency[];

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  ngOnInit(): void {
    const tID = this.routeParam.observeParam(this.route, 'table', UUIDs.check);
    const eID = this.routeParam.observeParam(this.route, 'entry', e => Number(e) != NaN ? Number(e) : null);

    tID.subscribe(tid => this.loadMetadata(tid), e => this.handleError(e));
    tID.subscribe(tid => this.loadDependents(tid), e => this.handleError(e));

    Observable.zip(tID, eID).subscribe(([tid, eid]) => this.loadData(tid, eid), e => this.handleError(e));
  }

  async loadMetadata(id: UUID): Promise<void> {
    try {
      const table = await this.metadataService.getTable(id);
      this.table = exTable(table);
    } catch (e) {
      this.handleError(e);
    }
  }

  async loadDependents(id: UUID): Promise<void> {
    const dependents: Dependency[] = [];
    try {
      const deps = await this.metadataService.getDependents(id);
      for (const dep of deps) {
        const table = await this.metadataService.getTable(dep.id);
        const colName = Columns.apiName(dep.columns[0]);

        const data = (await this.dataService.getAll(table.id)).
          filter(entry => entry[colName] === this.entry.id);

        dependents.push({
          tbl: exTable(table),
          col: dep.columns[0].name,
          data: data,
          displayData: data.slice(0, this.entriesPerPage)
        });
      }

    } catch (e) {
      this.handleError(e);
    }
    this.dependents = dependents;
  }

  async loadData(tableId: UUID, entryId: number): Promise<void> {
    return await this.dataService.get(tableId, entryId)
      .then(d => { this.entry = d; })
      .catch(e => this.handleError(e));
  }

  goBack(): void {
    this.location.back();
  }

  async delete(): Promise<void> {
    await this.dataService.delete(this.table.id, this.entry)
      .then(() => this.location.back())
      .catch(e => this.handleError(e));
  }

  showPage(dep: { data: Row[], displayData: Row[] }, page: number) {
    dep.displayData = dep.data.slice(page * this.entriesPerPage, (page + 1) * this.entriesPerPage);
  }
}
