import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MetadataService } from '../services/metadata.service';
import { DataService } from '../services/data.service';

import { TablesComponent } from './tables.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule
  ],
  declarations: [
    TablesComponent,
    TableComponent
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
