import { Component, Input, forwardRef } from '@angular/core';

import { Router } from '@angular/router';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, FKConstraint } from '../../shared/metadata.model';
import { Columns } from '../../shared/metadata.utils';
import { MetadataService } from '../services/metadata.service'
import { DataService } from '../services/data.service'

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
  @Input() summarize: boolean;
  private innerValue: any = undefined;

  tblName: string;
  fkCol: Column;
  fkModel: any;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private dataService: DataService,
    private metadataService: MetadataService
  ) {
  }

  get value(): any {
    return this.innerValue;
  }

  async writeValue(value: any) {
    if (!this.col) {
      this.innerValue = "Error!";
      return;
    }

    if (this.col.type === 'IMAGE') {
      if (value) {
        const ab = new Uint8Array(value.data);
        const data = new Blob([ab], { type: 'image/*' });
        const oUrl = window.URL.createObjectURL(data);
        this.innerValue = this.sanitizer.bypassSecurityTrustResourceUrl(oUrl);
        return;
      }
    } else if (this.col.type === 'FK') {
      if (value) {
        const tgt = (this.col.constraint as FKConstraint).target;

        const tblP = this.metadataService.getTable(tgt);
        const colP = tblP.then(t => t.columns.find(c => c.inSummary));

        const dataP = this.dataService.get(tgt, value);
        const colDataP = Promise.all([colP, dataP]);

        tblP.then(t => { this.tblName = t.name; });
        colP.then(c => { if (c) this.fkCol = c; });
        colDataP.then(([col, data]) => { if (col && data) { this.fkModel = (data as any)[Columns.apiName(col)]; } });
      }
    }
    if (value !== this.innerValue)
      this.innerValue = value;
  }

  registerOnChange() { }
  registerOnTouched() { }

  goTo(tbl: string, entry: number, event: Event) {
    event.preventDefault();
    this.router.navigate(['/data', tbl, entry]);
  }
}
