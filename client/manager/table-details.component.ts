import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { UUID, Table, FKConstraint } from '../../shared/metadata.model';
import { UUIDs } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';
import { ErrorHandling, getPath } from '../services/utils';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './table-details.component.html'
})

export class TableDetailsComponent extends ErrorHandling implements OnInit {
  @Input() table: Table;
  path: string;
  dependents: Table[];

  constructor(
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  ngOnInit(): void {
    const tID = this.routeParam.observeParam(this.route, 'table', UUIDs.check);
    tID.subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    const table = await this.metadataService.getTable(id);
    this.path = getPath(table, await this.metadataService.getFolders());
    this.table = table;
    table.columns
      .filter(col => col.type === 'FK')
      .forEach(col => {
        const tgt = (col.constraint as FKConstraint).target;
        (col as any).resolvedName = this.metadataService.getTable(tgt)
          .then(t => t.name);
      });

    this.dependents = await this.metadataService.getDependents(table);
  }

  goBack(): void {
    this.location.back();
  }
}
