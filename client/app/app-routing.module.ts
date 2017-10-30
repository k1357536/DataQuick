import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { TableListComponent } from '../manager/table-list.component';
import { TableEditorComponent } from '../manager/table-editor.component';

import { TablesComponent } from '../data/tables.component';
import { TableComponent } from '../data/table.component';
import { EntryComponent } from '../data/entry.component';
import { EntryEditorComponent } from '../data/entry-editor.component';

import { SetupComponent } from '../setup/setup.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'manager', children: [
      { path: '', component: TableListComponent },
      { path: ':id', component: TableEditorComponent }]
  },
  {
    path: 'data', children: [
      { path: '', component: TablesComponent },
      { path: ':id', component: TableComponent },
      { path: ':table/add', component: EntryEditorComponent },
      { path: ':table/:entry', component: EntryComponent },
      { path: ':table/:entry/edit', component: EntryEditorComponent }]
  },
  { path: 'setup', component: SetupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
