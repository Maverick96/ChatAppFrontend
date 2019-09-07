import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoCallService {
  private userData: Subject<object> = new Subject();
  private userData$ = this.userData.asObservable();

  private initiatorData: Subject<object> = new Subject();
  private initiatorData$ = this.initiatorData.asObservable();

  private receiverData: Subject<object> = new Subject();
  private receiverData$ = this.receiverData.asObservable();

  constructor() { }

  getSelectedUser() {
    return this.userData$;
  }

  setSelectedUser(user) {
    this.userData.next(user);
  }

  getInitiatorData() {
    return this.initiatorData$;
  }

  setInitiatorData(initData) {
    this.initiatorData.next(initData);
  }

  getReceiverData() {
    return this.receiverData$;
  }

  setReceiverData(receiverData) {
    this.receiverData.next(receiverData);
  }

}
