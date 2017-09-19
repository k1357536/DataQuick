import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { TableListComponent } from './table-list.component';
import { TableEditorComponent } from './table-editor.component';

import { MetadataService } from '../services/metadata.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    TableListComponent,
    TableEditorComponent
  ],
  bootstrap: [
  ],
  providers: [
    MetadataService
  ],
  exports: [
    TableEditorComponent
  ]
})
export class EditorModule { }
