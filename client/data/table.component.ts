import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Location } from '@angular/common';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType } from '../../shared/metadata.model';

import { Observable } from 'rxjs/Observable';

import { TableEx, exTable } from './utils';

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input() table: TableEx;
  data: (any | { id: number })[];
  newName: string;
  errorMsg: string = null;
  ColumnType = ColumnType; // for view

  constructor(
    private router: Router,
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
    this.router.navigate(['/data', this.table.id, "add"]);
  }

  onSelect(row: { id: number }, event: any): void {
    event.stopPropagation();
    this.router.navigate(['/data', this.table.id, String(row.id)]);
  }

  delete(row: { id: number }, event: any): void {
    event.stopPropagation();
    this.errorMsg = "Not supported yet!";
  }

  async load(id: string): Promise<void> {
    await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .then(t => this.dataService.getAll(t.id))
      .then(d => this.data = d)
      .catch(e => { this.errorMsg = e; });
  }

  goBack(): void {
    this.location.back();
  }
}
