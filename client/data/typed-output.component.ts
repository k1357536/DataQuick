import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, ColumnType } from '../../shared/metadata.model';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypedOutputComponent),
  multi: true
};

@Component({
  templateUrl: './typed-output.component.html',
  selector: 'typed-output',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TypedOutputComponent implements ControlValueAccessor {
  @Input() col: Column;
  private innerValue: any = undefined;
  ColumnType = ColumnType; // for view

  get value(): any {
    return this.innerValue;
  }

  writeValue(value: any) {
    if (value !== this.innerValue)
      this.innerValue = value;
  }

  registerOnChange(fn: any) { }
  registerOnTouched(fn: any) { }
}
