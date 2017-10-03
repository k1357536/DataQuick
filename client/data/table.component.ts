import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Location } from '@angular/common';

import { TableProposal, Table, Column, Columns, ColumnType, ColumnTypes } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { Observable } from 'rxjs/Observable';

interface ColumnEx extends Column {
  apiName: string;
}

interface TableEx extends Table {
  columns: ColumnEx[];
}

function exTable(tbl: Table): TableEx {
  (tbl as TableEx).columns.forEach(c => c.apiName = Columns.apiName(c));
  return tbl as TableEx;
}

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input() table: TableEx;
  data: any[];
  newName: string;
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

  add(): void {

  }

  async load(id: string): Promise<void> {
    await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .then(t => this.dataService.getAll(t))
      .then(d => this.data = d)
      .catch(e => this.errorMsg = e);
  }
}
