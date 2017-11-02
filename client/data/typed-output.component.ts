import { Component, Input, forwardRef } from '@angular/core';

import { Router } from '@angular/router';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, ColumnType } from '../../shared/metadata.model';

import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  get value(): any {
    return this.innerValue;
  }

  writeValue(value: any) {
    if (this.col.type == ColumnType.IMAGE)
      if (value) {
        const ab = new Uint8Array(value.data);
        const data = new Blob([ab], { type: 'image/*' });
        const oUrl = window.URL.createObjectURL(data);
        this.innerValue = this.sanitizer.bypassSecurityTrustResourceUrl(oUrl);
        return;
      }
    if (value !== this.innerValue)
      this.innerValue = value;
  }

  registerOnChange(fn: any) { }
  registerOnTouched(fn: any) { }

  goTo(tbl: string, entry: number, event: Event) {
    event.preventDefault();
    this.router.navigate(['/data', tbl, entry]);
  }
}
