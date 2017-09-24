import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Location } from '@angular/common';

import { Table, Column, ColumnType } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-editor.component.html'
})

export class TableEditorComponent implements OnInit {
  readonly columnTypes = ColumnType.ALL_TYPES;

  @Input() table: Table;
  errorMsg: string = null;

  constructor(
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('id')))
      .switchMap((p: string) => this.metadataService.getTable(p))
      .subscribe(table => this.table = table, e => this.errorMsg = e);
  }

  add(): void {
    this.table.columns.push(new Column("", ColumnType.STRING.id, false, false));
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
