import { Component } from '@angular/core';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter'

@Component({
  selector: 'app',
  template: `
    <app-nav title="{{title}}"></app-nav>
    <div class="pt-4" [class.container-fluid]="fluid" [class.container]="!fluid">
      <router-outlet></router-outlet>
    </div>
  `
})

export class AppComponent {
  title = 'DataQuick';
  fluid = false;
  constructor(router: Router, route: ActivatedRoute) {
    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(_ => {
        const ars = route.snapshot;
        this.fluid = ars.firstChild && ars.firstChild.data && ars.firstChild.data['fluid'];
      });
  }
}
