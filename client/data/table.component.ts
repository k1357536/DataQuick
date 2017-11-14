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
const NAV_PAGES_VISIBLE = 5;

interface NavData {
  numEntries: number,
  numPages: number,
  currentPage: number,
  pages: number[]
};

@Component({
  templateUrl: './table.component.html'
})
export class TableComponent extends ErrorHandling implements OnInit {
  @Input() table: TableEx;
  data: Row[];

  sortCol: Column | null;
  sortASC = true;

  readonly nav: NavData = {
    numEntries: 0,
    numPages: 0,
    currentPage: 0,
    pages: []
  };

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
      .then(() => this.loadData())
      .catch(e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    await this.metadataService.getTable(id)
      .then(t => this.table = exTable(t))
      .then(() => this.loadData());
  }

  async loadData(): Promise<void> {
    const sortCol = this.sortCol ? Columns.apiName(this.sortCol) : null;
    this.dataService.countRows(this.table.id)
      .then(cnt => this.updateNav(cnt))
      .then(() => this.dataService.getAll(this.table.id, sortCol, this.sortASC, this.nav.currentPage, ENTRIES_PER_PAGE))
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
    await this.loadData();
  }

  private updateNav(cnt: number): void {
    const nav = this.nav;

    nav.numEntries = cnt;
    nav.numPages = Math.floor(((nav.numEntries + ENTRIES_PER_PAGE - 1) / ENTRIES_PER_PAGE));

    const navStart = Math.max(0, nav.currentPage - NAV_PAGES_VISIBLE);
    const navEnd = Math.min(nav.numPages, nav.currentPage + NAV_PAGES_VISIBLE);

    nav.pages = Array.from({ length: navEnd - navStart }, (_, i) => i + navStart);

    if (nav.currentPage > nav.numPages - 1)
      nav.currentPage = Math.max(nav.numPages - 1, 0);
  }

  goBack(): void {
    this.location.back();
  }

  async setPage(num: number) {
    if (num >= 0 && num < this.nav.numPages)
      this.nav.currentPage = num;
    await this.loadData();
  }

  async lastPage() {
    if (this.nav.currentPage > 0)
      this.nav.currentPage--;
    await this.loadData();
  }

  async nextPage() {
    if (this.nav.currentPage + 1 < this.nav.numPages)
      this.nav.currentPage++;
    await this.loadData();
  }
}
