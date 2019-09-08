import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackService: MatSnackBar) { }

  showAlert(msg) {
    this.snackService.open(msg);
  }
}
