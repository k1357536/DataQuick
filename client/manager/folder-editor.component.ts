import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';

import { UUID, Table, Folder } from '../../shared/metadata.model';
import { UUIDs } from '../../shared/metadata.utils';

import { MetadataService } from '../services/metadata.service';
import { RouteParamService } from '../services/route-param.service';

import { getPath } from '../data/utils';

import { ErrorHandling } from '../utils';

import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: './folder-editor.component.html',
})

export class FolderEditorComponent extends ErrorHandling implements OnInit {
  @Input() folder: Folder;
  folders: Folder[];
  tables: Table[];

  constructor(
    private metadataService: MetadataService,
    private location: Location,
    private route: ActivatedRoute,
    private routeParam: RouteParamService) { super(); }

  ngOnInit(): void {
    const fID = this.routeParam.observeParam(this.route, 'folder', UUIDs.check);
    fID.subscribe(id => this.load(id), e => this.handleError(e));
  }

  async load(id: UUID): Promise<void> {
    this.folders = await this.metadataService.getFolders();

    const result = this.folders.find(f => f.id === id);
    if (result) {
      this.folder = result;
      this.tables = await this.metadataService.getTables();
    }
    else
      this.handleError('Folder not found!');
  }

  async save(): Promise<void> {
    if (this.folder)
      await this.metadataService.updateFolder(this.folder)
        .then(() => this.goBack())
        .catch(e => this.handleError(e));
  }

  goBack(): void {
    this.location.back();
  }

  path(folder: Folder): string {
    return getPath(folder, this.folders);
  }
}
