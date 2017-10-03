import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { TableListComponent } from '../editor/table-list.component';
import { TableEditorComponent } from '../editor/table-editor.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'editor', children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: TableListComponent },
      { path: 'editor/:id', component: TableEditorComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
