import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { Table, Folder } from '../../shared/metadata.model';
import { Folders } from '../../shared/metadata.utils';
import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

interface TableEx extends Table {
  rows: number;
}

@Component({
  templateUrl: './table-list.component.html'
})

export class TableListComponent implements OnInit {
  folders: Folder[];
  newFolderName: string = "";

  tables: TableEx[];
  newName: string = "";

  errorMsg: string | null = null;

  constructor(
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService) { }

  private handleError(e: any): void {
    this.errorMsg = e._body ? e + ' ' + e._body : e;
    console.error(e);
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.getFolders(), this.getTables()]);
  }

  onSelect(id: string): void {
    this.router.navigate(['/manager', id]);
  }

  onSelectFolder(id: string): void {
    this.router.navigate(['/manager/folder/', id]);
  }

  async addFolder(): Promise<void> {
    if (!this.newFolderName || this.newFolderName.length <= 0)
      this.errorMsg = "No table name specified!";
    else {
      await this.metadataService.addFolder(this.newFolderName, Folders.getRoot())
        .then(() => this.errorMsg = "")
        .catch(e => {
          this.handleError(e);
        });
      this.newFolderName = "";
      await this.getFolders();
    }
  }

  async add(): Promise<void> {
    if (!this.newName || this.newName.length <= 0)
      this.errorMsg = "No table name specified!";
    else {
      await this.metadataService.addTable(this.newName, Folders.getRoot())
        .then(() => this.errorMsg = "")
        .catch(e => {
          if (e.status && e.status === 409)
            this.errorMsg = "Table name already exists!";
          else
            this.handleError(e);
        });
      this.newName = "";
      await this.getTables();
    }
  }

  async delete(tbl: Table): Promise<void> {
    await this.metadataService.deleteTable(tbl)
      .catch(e => this.handleError(e));
    await this.getTables();
  }

  trackById(index: number, _: Table): number {
    return index; // TODO
  }

  private async getFolders(): Promise<void> {
    try {
      this.folders = await this.metadataService.getFolders();
    }
    catch (e) {
      this.handleError(e);
    }
  }

  private async getTables(): Promise<void> {
    try {
      this.tables = await this.metadataService.getTables() as TableEx[];
      this.tables.forEach(async tbl => {
        const rows = await this.dataService.countRows(tbl.id);
        tbl.rows = rows;
      });
    }
    catch (e) {
      this.handleError(e);
    }
  }

  async export(): Promise<void> {
    const data = await Promise.all([
      this.metadataService.getFolders(),
      this.metadataService.getTables()])
      .then(data => [data[0], data[1]])
      .then(data => JSON.stringify(data, null, '\t'))
      .then(data => new Blob([data], { type: 'application/json' }));

    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(data);
    a.download = 'export.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  import(): void {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.hidden = true;

    input.onchange = () => {
      document.body.removeChild(input);
      if (input.files && input.files.length === 1) {
        const file = input.files[0];
        const fr = new FileReader();

        fr.onload = async () => {
          try {
            const result = JSON.parse(fr.result) as [Folder[], Table[]];
            for (let f of result[0])
              await this.metadataService.importFolder(f);
            for (let t of result[1])
              await this.metadataService.importTable(t);
          } catch (e) {
            this.handleError(e);
          }
          await this.ngOnInit();
        }

        fr.readAsText(file);
      }
    };

    document.body.appendChild(input);
    input.click();
  }
}
