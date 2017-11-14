import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { DataService } from '../services/data.service'

import { FKConstraint } from '../../shared/metadata.model';

import { ColumnEx } from './utils';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypedInputComponent),
  multi: true
};

@Component({
  templateUrl: './typed-input.component.html',
  selector: 'typed-input',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TypedInputComponent implements ControlValueAccessor {
  @Input() col: ColumnEx;
  private innerValue: any = undefined;

  private onChangeCallback: (_: any) => void = () => { };
  private onTouchedCallback: () => void = () => { };

  options: Promise<{ id: number, label: string }[]>;

  constructor(
    private dataService: DataService
  ) { }

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
    if (this.col.type === 'FK') {
      this.options = this.dataService.getSummaries((this.col.constraint as FKConstraint).target);
    }
    if (value !== this.innerValue)
      this.innerValue = value;
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  uploadImg() {
    const input = window.document.createElement('input');
    input.type = 'file';
    input.hidden = true;

    input.onchange = () => {
      document.body.removeChild(input);
      alert('Not jet supported!');
      // if (input.files.length === 1) {
      //   const file = input.files[0];
      //   const fr = new FileReader();
      //
      //   fr.onload = async () => {
      //     const array = new Uint8Array(fr.result);
      //     const v = Array.from(array);
      //     console.log(v);
      //     this.innerValue = v;
      //     this.onChangeCallback(v);
      //   }
      //
      //   fr.readAsArrayBuffer(file);
      // }
    };

    document.body.appendChild(input);
    input.click();
  }
}
