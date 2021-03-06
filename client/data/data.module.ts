import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ServicesModule } from '../services/services.module';

import { TablesComponent } from './tables.component';
import { TableComponent } from './table.component';
import { EntryComponent } from './entry.component';
import { EntryEditorComponent } from './entry-editor.component';
import { TypedInputComponent } from './typed-input.component';
import { TypedOutputComponent } from './typed-output.component';
import { PagingComponent } from './paging.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgbModule,
    ServicesModule
  ],
  declarations: [
    TablesComponent,
    TableComponent,
    EntryComponent,
    EntryEditorComponent,
    TypedInputComponent,
    TypedOutputComponent,
    PagingComponent
  ],
})
export class DataModule { }
