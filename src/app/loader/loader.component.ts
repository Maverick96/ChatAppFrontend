import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  loaderStatus$: Subscription;
  mode: string = 'indeterminate';
  color: string = 'primary';
  constructor(private loaderService: LoaderService) {

  }

  ngOnInit() {
    this.loaderStatus$ = this.loaderService.getLoaderStatus().subscribe(state => {
      this.isLoading = state;
    })
  }

  ngOnDestroy() {
    if (this.loaderStatus$) {
      this.loaderStatus$.unsubscribe();
    }
  }

}
