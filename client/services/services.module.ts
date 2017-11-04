import { NgModule } from '@angular/core';

import { MetadataService } from './metadata.service';
import { DataService } from './data.service';
import { RouteParamService } from './route-param.service';

import { ColumnTypePipe } from './column-type.pipe';

@NgModule({
  declarations: [
    ColumnTypePipe
  ],
  providers: [
    MetadataService,
    DataService,
    RouteParamService
  ],
  exports: [
    ColumnTypePipe
  ]
})
export class ServicesModule { }
