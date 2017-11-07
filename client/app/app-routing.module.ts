import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { TableListComponent } from '../manager/table-list.component';
import { FolderListComponent } from '../manager/folder-list.component';
import { TableDetailsComponent } from '../manager/table-details.component';
import { TableEditorComponent } from '../manager/table-editor.component';

import { TablesComponent } from '../data/tables.component';
import { TableComponent } from '../data/table.component';
import { EntryComponent } from '../data/entry.component';
import { EntryEditorComponent } from '../data/entry-editor.component';

import { FoldersComponent } from '../folders/folders.component'

import { SetupComponent } from '../setup/setup.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },

  { path: 'manager/tables', component: TableListComponent },
  { path: 'manager/folders', component: FolderListComponent },
  { path: 'manager/tables/:table', component: TableDetailsComponent },
  { path: 'manager/tables/:table/edit', component: TableEditorComponent },

  { path: 'data', component: TablesComponent },
  { path: 'data/:table', component: TableComponent, data: { fluid: true } },
  { path: 'data/:table/add', component: EntryEditorComponent },
  { path: 'data/:table/:entry', component: EntryComponent },
  { path: 'data/:table/:entry/edit', component: EntryEditorComponent },

  { path: 'folders', component: FoldersComponent },

  { path: 'setup', component: SetupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
