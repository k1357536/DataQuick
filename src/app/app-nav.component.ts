import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
})

export class AppNavComponent {
  @Input() title: string;
  isNavbarCollapsed = true;
}
