import { Component } from '@angular/core';

import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter'

@Component({
  selector: 'app',
  template: `
    <app-nav title="{{title}}"></app-nav>
    <div class="pt-4" [class.container-fluid]="fluid" [class.container]="!fluid">
    <h1>{{fluid}}</h1>
      <router-outlet></router-outlet>
    </div>
  `
})

export class AppComponent {
  title = 'DataQuick';
  fluid = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute) {
    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => {
        const ars = route.snapshot;
        this.fluid = ars.firstChild && ars.firstChild.data && ars.firstChild.data['fluid'];
      });
  }
}
