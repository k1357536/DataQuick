import { Injectable } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class RouteParamService {
  observeParam<T>(route: ActivatedRoute, param: string, mapF: (v: string) => T | null): Observable<T> {
    return (route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get(param)))
      .filter(v => v != null) as Observable<string>)
      .map(mapF)
      .filter(v => v != null) as Observable<T>;
  }

  observeParamNullable<T>(route: ActivatedRoute, param: string, mapF: (v: string) => T | null): Observable<T | null> {
    return route.paramMap
      .switchMap((params: ParamMap) => Observable.of(params.get(param)))
      .map(v => v != null ? mapF(v) : null);
  }
}
