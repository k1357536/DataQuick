import { Component, Input, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Location } from '@angular/common';

import { Table, ColumnType, FKConstraint } from '../../shared/metadata.model';

import { MetadataService } from '../services/metadata.service';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-details.component.html'
})

export class TableDetailsComponent implements OnInit {
  readonly ColumnType = ColumnType;

  @Input() table: Table;
  errorMsg: string | null = null;

  constructor(
    private metadataService: MetadataService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) { }

  private handleError(e: any): void {
    this.errorMsg = e._body ? e + ' ' + e._body : e;
    console.error(e);
  }

  ngOnInit(): void {
    (this.route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get('id')))
      .filter(id => id != null) as Observable<string>)
      .subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: string): Promise<void> {
    const table = await this.metadataService.getTable(id);
    this.table = table;
    table.columns
      .filter(col => col.type == ColumnType.FK)
      .forEach(col => {
        const tgt = (col.constraint as FKConstraint).target;
        (col as any).resolvedName = this.metadataService.getTable(tgt)
          .then(t => t.name);
      });
  }

  edit(): void {
    this.router.navigate(['/manager', this.table.id, 'edit']);
  }

  goBack(): void {
    this.location.back();
  }
}
