import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BASE_URL } from 'src/app/app.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private socket;
  private userId: number;
  constructor() {
    this.socket = io(BASE_URL);
    const userData = JSON.parse(localStorage.getItem('user-data'));
    this.userId = userData.userId;
    this.socket.emit('register', {
      userId: this.userId
    })
  }

  sendMessage(msg) {
    this.socket.emit('message', msg);
  }

  receiveMessages() {
    // 
    return Observable.create((observer) => {
      this.socket.on(`message`, (msg) => {
        observer.next(msg);
      });
    });
  }
}
