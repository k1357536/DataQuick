import { Pipe, PipeTransform } from '@angular/core';

import { ColumnType, ColumnTypes } from './../../shared/metadata.model';

@Pipe({ name: 'columntype' })
export class ColumnTypePipe implements PipeTransform {
  transform(columnType: ColumnType): string {
    return ColumnTypes.get(columnType).name;
  }
}
