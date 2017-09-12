import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <app-nav title="{{title}}"></app-nav>
    <div class="container pt-4">
      <router-outlet></router-outlet>
    </div>
  `
})

export class AppComponent {
  title = 'DataQuick';
}
