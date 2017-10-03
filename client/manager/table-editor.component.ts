import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Location } from '@angular/common';

import { Table, Column, Columns, ColumnType, ColumnTypes } from '../../shared/metadata.model';

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

  @Input() table: Table;
  errorMsg: string = null;

  constructor(
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('id')))
      .subscribe(id => this.load(id), e => this.errorMsg = e);
  }

  async load(id: string): Promise<void> {
    const table = await this.metadataService.getTable(id);
    this.table = table;
  }

  add(): void {
    this.table.columns.push(Columns.create(""));
  }

  changeType(col: Column, typeId: number): void {
    col.type = typeId;
  }

  async save(): Promise<void> {
    if (this.table)
      try {
        await this.metadataService.updateTable(this.table);
        this.goBack();
      } catch (e) {
        this.errorMsg = e;
      }
  }

  goBack(): void {
    this.location.back();
  }
}
