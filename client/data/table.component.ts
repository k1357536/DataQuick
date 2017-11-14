import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';
import { RouteParamService } from '../services/route-param.service';
import { ErrorHandling } from '../services/utils';

import { UUID, Column, Row } from '../../shared/metadata.model';
import { UUIDs, Columns } from '../../shared/metadata.utils';

import { TableEx, exTable } from './utils';

const ENTRIES_PER_PAGE = 15;

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent extends ErrorHandling implements OnInit {
  @Input() table: TableEx;
  data: Row[];

  sortCol: Column | null;
  sortASC = true;

  numEntries = 0;

  newName: string;

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  ngOnInit(): void {
    this.routeParam
      .observeParam(this.route, 'table', UUIDs.check)
      .subscribe(tid => this.load(tid), e => this.handleError(e));
  }

  async delete(row: Row, event: any): Promise<void> {
    event.stopPropagation();
    await this.dataService.delete(this.table.id, row)
      .then(() => this.loadData(0))
      .catch(e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .then(() => this.loadData(0));
  }

  async loadData(page: number): Promise<void> {

    const sortCol = this.sortCol ? Columns.apiName(this.sortCol) : null;
    this.dataService.countRows(this.table.id)
      .then(cnt => { this.numEntries = cnt; })
      .then(() => this.dataService.getAll(this.table.id, sortCol, this.sortASC, page, ENTRIES_PER_PAGE))
      .then(d => this.data = d)
      .catch(e => this.handleError(e));
  }

  async sort(col: Column): Promise<void> {
    if (this.sortCol === col) {
      if (this.sortASC)
        this.sortASC = false;
      else
        this.sortCol = null;
    } else {
      this.sortCol = col;
      this.sortASC = true;
    }
    await this.loadData(0);
  }

  goBack(): void {
    this.location.back();
  }
}
