import { Component, Input, forwardRef } from '@angular/core';

import { Router } from '@angular/router';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { Column, ColumnType, FKConstraint } from '../../shared/metadata.model';
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
  @Input() col: Column | Promise<Column>;
  @Input() summarize: boolean;
  private innerValue: any = undefined;
  ColumnType = ColumnType; // for view

  tblName: Promise<string>;
  fkCol: Promise<Column>;
  fkModel: Promise<any>;

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

    if (this.col instanceof Promise) {
      this.col = await (this.col as Promise<Column>);
    }

    const col = this.col as Column;

    if (!col) {
      this.innerValue = "Error!";
      return;
    }

    if (col.type === ColumnType.IMAGE) {
      if (value) {
        const ab = new Uint8Array(value.data);
        const data = new Blob([ab], { type: 'image/*' });
        const oUrl = window.URL.createObjectURL(data);
        this.innerValue = this.sanitizer.bypassSecurityTrustResourceUrl(oUrl);
        return;
      }
    } else if (col.type === ColumnType.FK) {
      const tgt = (col.constraint as FKConstraint).target;
      const tbl = this.metadataService.getTable(tgt);

      this.tblName = tbl.then(t => t.name);

      if (value) {
        let summaryCol = tbl.then(t => t.columns.find(c => c.inSummary));
        this.fkCol = summaryCol;

        this.fkModel = this.fkCol
          .then(s => Promise.all([s, this.dataService.get(tgt, value)]))
          .then(r => (r[1] as any)[Columns.apiName(r[0])]);
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
