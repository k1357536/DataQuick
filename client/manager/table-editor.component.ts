import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Location } from '@angular/common';

import { Table, Column, ColumnType } from '../../shared/metadata.model';
import { Columns, ColumnTypes } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-editor.component.html'
})

export class TableEditorComponent implements OnInit {
  readonly columnTypes = ColumnTypes.ALL;
  readonly ColumnType = ColumnType;

  @Input() table: Table;
  errorMsg: string = null;

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute) { }

  private handleError(e: any): void {
    this.errorMsg = e._body ? e + ' ' + e._body : e;
    console.error(e);
  }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('id')))
      .subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: string): Promise<void> {
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

  changeType(col: Column, typeId: number): void {
    col.type = typeId;
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
