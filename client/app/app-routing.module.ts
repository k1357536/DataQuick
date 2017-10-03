import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { TableListComponent } from '../manager/table-list.component';
import { TableEditorComponent } from '../manager/table-editor.component';

import { TablesComponent } from '../data/tables.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'manager', children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TableListComponent },
      { path: 'editor/:id', component: TableEditorComponent }]
  },
  {
    path: 'data', children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TablesComponent }]
      //{ path: 'editor/:id', component: TableEditorComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
