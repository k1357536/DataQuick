import { Pipe, PipeTransform } from '@angular/core';

import { ColumnType } from './../../shared/metadata.model';
import { ColumnTypes } from './../../shared/metadata.utils';

@Pipe({ name: 'columntype' })
export class ColumnTypePipe implements PipeTransform {
  transform(columnType: ColumnType): string {
    return ColumnTypes.getName(columnType);
  }
}
