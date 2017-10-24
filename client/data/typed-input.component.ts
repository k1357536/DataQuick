import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, ColumnType } from '../../shared/metadata.model';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypedInputComponent),
  multi: true
};

@Component({
  template: `
  <ng-container *ngIf="col" [ngSwitch]="col.type">
    <input *ngSwitchCase="ColumnType.AUTO" type="number" class="form-control" [ngModel]="value" disabled>
    <input *ngSwitchCase="ColumnType.NUMBER" type="number" class="form-control" [(ngModel)]="value" (blur)="onBlur()" />
    <input *ngSwitchCase="ColumnType.DATE" type="date" class="form-control" [ngModel]="value | date: 'y-MM-dd'" (ngModelChange)="value=$event" (blur)="onBlur()" />
    <input *ngSwitchCase="ColumnType.BOOL" type="checkbox" class="form-control" [(ngModel)]="value" (blur)="onBlur()" />
    <input *ngSwitchDefault type="text" class="form-control" [(ngModel)]="value" (blur)="onBlur()" />
  </ng-container>`,
  selector: 'typed-input',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TypedInputComponent implements ControlValueAccessor {
  @Input() col: Column;
  private innerValue: any = undefined;
  ColumnType = ColumnType; // for view

  private onChangeCallback: (_: any) => void = () => { };
  private onTouchedCallback: () => void = () => { };

  get value(): any {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  onBlur() {
    this.onTouchedCallback();
  }

  writeValue(value: any) {
    if (value !== this.innerValue)
      this.innerValue = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}