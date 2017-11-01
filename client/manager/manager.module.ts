import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ServicesModule } from '../services/services.module';

import { TableListComponent } from './table-list.component';
import { TableDetailsComponent } from './table-details.component';
import { TableEditorComponent } from './table-editor.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule,
    ServicesModule
  ],
  declarations: [
    TableListComponent,
    TableDetailsComponent,
    TableEditorComponent
  ]
})
export class ManagerModule { }
