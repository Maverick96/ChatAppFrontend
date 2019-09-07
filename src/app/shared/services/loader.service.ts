import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loaderStatus: Subject<boolean> = new Subject();
  private loaderStatus$ = this.loaderStatus.asObservable();
  constructor() { }

  getLoaderStatus() {
    return this.loaderStatus$;
  }

  setLoaderStatus(state) {
    this.loaderStatus.next(state);
  }

}
