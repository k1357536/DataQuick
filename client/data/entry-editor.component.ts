import { Component, OnInit, Input } from '@angular/core';

import { Location } from '@angular/common';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType } from '../../shared/metadata.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

import { TableEx, exTable } from './utils';

@Component({
  templateUrl: './entry-editor.component.html'
})
export class EntryEditorComponent implements OnInit {
  @Input() table: TableEx;
  @Input() entry: { id: number };
  errorMsg: string = null;
  ColumnType = ColumnType; // for view

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const tableId = this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('table')));
    const entryId = this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('entry')));

    tableId.subscribe(
      tid => this.loadMetadata(tid),
      e => this.errorMsg = e);

    Observable.zip(tableId, entryId).subscribe(
      ([tid, eid]) => {
        if (eid && Number(eid) != NaN)
          return this.loadData(tid, Number(eid));
        else
          this.entry = { id: NaN };
      },
      e => this.errorMsg = e);
  }

  async loadMetadata(id: string): Promise<void> {
    return await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .catch(e => this.errorMsg = e);
  }

  async loadData(tableId: string, entryId: number): Promise<void> {
    return await this.dataService.get(tableId, entryId)
      .then(d => this.entry = d)
      .catch(e => this.errorMsg = e);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.entry.id === 0) {
      this.dataService.add(this.table.id, this.entry)
        .then(() => this.goBack())
        .catch(e => this.errorMsg = e);
    } else {
      this.dataService.update(this.table.id, this.entry)
        .then(() => this.goBack())
        .catch(e => this.errorMsg = e);
    }
  }
}
