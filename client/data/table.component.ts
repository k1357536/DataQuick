import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Location } from '@angular/common';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { ColumnType, Column } from '../../shared/metadata.model';
import { Columns } from '../../shared/metadata.utils';

import { Observable } from 'rxjs/Observable';

import { TableEx, exTable } from './utils';

const ENTRIES_PER_PAGE = 15;

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  @Input() table: TableEx;
  data: (any | { id: number })[];

  sortCol: Column;

  numEntries = 0;
  numPages = 0;
  currentPage = 0;
  pages: number[] = [];

  newName: string;
  errorMsg: string = null;
  ColumnType = ColumnType; // for view

  constructor(
    private router: Router,
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

  add(): void {
    this.router.navigate(['/data', this.table.id, "add"]);
  }

  onSelect(row: { id: number }, event: any): void {
    event.stopPropagation();
    this.router.navigate(['/data', this.table.id, String(row.id)]);
  }

  async delete(row: { id: number }, event: any): Promise<void> {
    event.stopPropagation();
    await this.dataService.delete(this.table.id, row)
      .then(() => this.loadData())
      .catch(e => this.handleError(e));
  }

  async load(id: string): Promise<void> {
    await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .then(() => this.loadData());
  }

  async loadData(): Promise<void> {
    const sortCol = this.sortCol ? Columns.apiName(this.sortCol) : null;
    this.dataService.countRows(this.table.id)
      .then(cnt => {
        this.numEntries = cnt;
        this.numPages = Math.floor(((this.numEntries + ENTRIES_PER_PAGE - 1) / ENTRIES_PER_PAGE));
        this.pages = Array.from({ length: this.numPages }, (v, i) => i);
        if (this.currentPage > this.numPages - 1)
          this.currentPage = Math.max(this.numPages - 1, 0);
      })
      .then(() => this.dataService.getAll(this.table.id, sortCol, this.currentPage, ENTRIES_PER_PAGE))
      .then(d => this.data = d)
      .catch(e => this.handleError(e));
  }

  async sort(col: Column): Promise<void> {
    if (this.sortCol === col)
      this.sortCol = null;
    else
      this.sortCol = col;
    await this.loadData();
  }

  goBack(): void {
    this.location.back();
  }

  async setPage(num: number) {
    if (num >= 0 && num < this.numPages)
      this.currentPage = num;
    await this.loadData();
  }

  async   lastPage() {
    if (this.currentPage > 0)
      this.currentPage--;
    await this.loadData();
  }

  async   nextPage() {
    if (this.currentPage + 1 < this.numPages)
      this.currentPage++;
    await this.loadData();
  }
}
