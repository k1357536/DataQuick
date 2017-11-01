import { NgModule } from '@angular/core';

import { MetadataService } from './metadata.service';
import { DataService } from './data.service';

import { ColumnTypePipe } from './column-type.pipe';

@NgModule({
  declarations: [
    ColumnTypePipe
  ],
  providers: [
    MetadataService,
    DataService
  ],
  exports: [
    ColumnTypePipe
  ]
})
export class ServicesModule { }
