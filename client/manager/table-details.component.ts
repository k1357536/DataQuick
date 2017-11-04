import { Component, Input, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { UUID, Table, ColumnType, FKConstraint } from '../../shared/metadata.model';
import { UUIDs } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';


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
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { }

  private handleError(e: any): void {
    console.error(e);
    if (e instanceof Error)
      this.errorMsg += e.message;
    else
      this.errorMsg = JSON.stringify(e);
  }

  ngOnInit(): void {
    const tID = this.routeParam.observeParam(this.route, 'table', UUIDs.check);
    tID.subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
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
