import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { UUID, Table, Column, ColumnType } from '../../shared/metadata.model';
import { UUIDs, Columns, ColumnTypes } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';


import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-editor.component.html'
})

export class TableEditorComponent implements OnInit {
  readonly columnTypes = ColumnTypes.ALL;

  @Input() table: Table;
  errorMsg: string | null = null;

  constructor(
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
    tID.subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    const table = await this.metadataService.getTable(id);
    this.table = table;
  }

  add(): void {
    this.table.columns.push(Columns.create(""));
  }

  delete(col: Column): void {
    const idx = this.table.columns.indexOf(col);
    if (idx > 0)
      this.table.columns.splice(idx, 1);
  }

  changeType(col: Column, typeId: string): void {
    if (ColumnTypes.ALL.find(c => c.id === typeId))
      col.type = typeId as ColumnType;
  }

  async save(): Promise<void> {
    if (this.table)
      await this.metadataService.updateTable(this.table)
        .then(() => this.goBack())
        .catch(e => this.handleError(e));
  }

  goBack(): void {
    this.location.back();
  }
}
