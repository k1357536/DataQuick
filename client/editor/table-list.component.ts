import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { TableProposal, Table, Column, ColumnType } from '../../shared/metadata.model';
import { MetadataService } from '../services/metadata.service';

@Component({
  templateUrl: './table-list.component.html'
})

export class TableListComponent implements OnInit {
  tables: Table[];
  newName: string;

  constructor(
    private router: Router,
    private metadataService: MetadataService) { }

  ngOnInit(): void {
    this.getTables();
  }

  onSelect(id: string): void {
    this.router.navigate(['/editor/editor', id]);
  }

  add(): void {
    this.metadataService
      .addTable(new TableProposal(this.newName))
      .then(t => this.getTables());
  }

  delete(tbl: Table): void {
    this.metadataService
      .deleteTable(tbl)
      .then(t => this.getTables());
  }

  trackById(index: number, table: Table): number {
    return index; // TODO
  }

  private getTables(): void {
    this.metadataService.getTables().then(tables => this.tables = tables);
  }
}
