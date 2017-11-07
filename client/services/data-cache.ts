import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/timer';

export class DataCache<K, V> {
  private readonly data: Map<K, Promise<V>> = new Map();
  private readonly CACHE_TIMEOUT_MS = 60 * 1000;
  private readonly cachClearInterval: Subscription;

  private cachHits = 0;
  private cachMisses = 0;

  constructor() {
    this.cachClearInterval = Observable
      .timer(this.CACHE_TIMEOUT_MS, this.CACHE_TIMEOUT_MS)
      .subscribe(() => this.clearCaches());
  }

  protected stopTimer() {
    this.cachClearInterval.unsubscribe();
  }

  protected clearCaches() {
    this.data.clear();
  }

  protected getCache(key: K, getter: () => Promise<V>): Promise<V> {
    if (this.data.has(key)) {
      this.cachHits++;
      this.reportStatus();

      return this.data.get(key) as Promise<V>;
    } else {
      this.cachMisses++;
      this.reportStatus();

      const p = getter();
      this.data.set(key, p);
      return p;
    }
  }

  private reportStatus() {
    if ((this.cachHits + this.cachMisses) % 10 == 0) {
      const hitRate = this.cachHits / (this.cachHits + this.cachMisses) * 100;
      console.log(hitRate + '% hitrate for ' + this.constructor.name);
    }
  }

  protected addAllCache(values: Promise<V[]>, getter: (v: V) => K) {
    values.then((vs) => {
      if (vs)
        vs.forEach(v => this.data.set(getter(v), Promise.resolve(v)));
    });
  }
}
