import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { TableListComponent } from '../manager/table-list.component';
import { TableEditorComponent } from '../manager/table-editor.component';

import { TablesComponent } from '../data/tables.component';
import { TableComponent } from '../data/table.component';

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
      { path: ':id', component: TableComponent }]
  },
  { path: 'setup', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
