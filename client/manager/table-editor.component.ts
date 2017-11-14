import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { UUID, Table, Column, Folder } from '../../shared/metadata.model';
import { UUIDs, Columns, ColumnTypes, Constraints } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';

import { getPath } from '../data/utils';

import { ErrorHandling } from '../utils';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-editor.component.html',
})

export class TableEditorComponent extends ErrorHandling implements OnInit {
  readonly columnTypes = ColumnTypes.ALL;

  @Input() table: Table;
  folders: Folder[];
  tables: Table[];

  constructor(
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  ngOnInit(): void {
    const tID = this.routeParam.observeParam(this.route, 'table', UUIDs.check);
    tID.subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    this.folders = await this.metadataService.getFolders();
    this.tables = await this.metadataService.getTables();
    this.table = await this.metadataService.getTable(id);
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
    const type = ColumnTypes.ALL.find(c => c.id === typeId);
    if (type) {
      col.type = type.id;
      col.constraint = Constraints.getDefault(type.id);
    }
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

  path(folder: Folder): string {
    return getPath(folder, this.folders);
  }
}
