import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { TablesComponent } from './tables.component';
import { TableComponent } from './table.component';
import { EntryComponent } from './entry.component';
import { EntryEditorComponent } from './entry-editor.component';
import { TypedInputComponent } from './typed-input.component';
import { TypedOutputComponent } from './typed-output.component';

import { ColumnTypePipe } from './column-type.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    TablesComponent,
    TableComponent,
    EntryComponent,
    EntryEditorComponent,
    TypedInputComponent,
    TypedOutputComponent,
    ColumnTypePipe
  ],
  bootstrap: [
  ],
  providers: [
    MetadataService,
    DataService
  ],
  exports: [
  ]
})
export class DataModule { }
