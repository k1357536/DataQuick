import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, ColumnType } from '../../shared/metadata.model';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypedOutputComponent),
  multi: true
};

@Component({
  template: `
  <ng-container *ngIf="col" [ngSwitch]="col.type">
    <ng-container *ngSwitchCase="ColumnType.DATE">{{value | date }}</ng-container>
    <ng-container *ngSwitchCase="ColumnType.BOOL" [ngSwitch]="value">
      <ng-container *ngSwitchCase="true">true</ng-container>
      <ng-container *ngSwitchCase="false">false</ng-container>
      <ng-container *ngSwitchDefault>-</ng-container>
    </ng-container>
    <ng-container *ngSwitchDefault>{{value  }}</ng-container>
  </ng-container>`,
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
