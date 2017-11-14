import { Component, Input, Output, EventEmitter } from '@angular/core';

import 'rxjs/add/observable/zip';

const NAV_PAGES_VISIBLE = 5;

@Component({
  templateUrl: './paging.component.html',
  selector: 'paging'
})

export class PagingComponent {
  num = 0;
  current = 0;
  numPages = 0;
  pages: number[] = [];

  @Output() currentPage = new EventEmitter<number>();

  @Input() entriesPerPage: number = 10;
  @Input() set numEntries(v: number) {
    this.num = v;
    this.updateNav();
  }

  async setPage(num: number) {
    if (num >= 0 && num < this.numPages) {
      this.current = num;
      this.currentPage.emit(this.current);
      this.updateNav();
    }
  }

  async lastPage() {
    if (this.current > 0) {
      this.current--;
      this.currentPage.emit(this.current);
      this.updateNav();
    }
  }

  async nextPage() {
    if (this.current + 1 < this.numPages) {
      this.current++;
      this.currentPage.emit(this.current);
      this.updateNav();
    }
  }

  private updateNav(): void {
    this.numPages = Math.floor(((this.num + this.entriesPerPage - 1) / this.entriesPerPage));

    const navStart = Math.max(0, this.current - NAV_PAGES_VISIBLE);
    const navEnd = Math.min(this.numPages, this.current + NAV_PAGES_VISIBLE);

    this.pages = Array.from({ length: navEnd - navStart }, (_, i) => i + navStart);

    if (this.current > this.numPages - 1)
      this.current = Math.max(this.numPages - 1, 0);
  }
}
