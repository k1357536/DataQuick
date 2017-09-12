import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { TableEditorComponent } from './table-editor.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule,
    NgbModule
  ],
  declarations: [
    TableEditorComponent
  ],
  bootstrap: [
  ],
  providers: [
  ],
  exports: [
    TableEditorComponent
  ]
})
export class EditorModule { }
