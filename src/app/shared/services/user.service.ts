import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/app/app.constants';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private selectedUser: Subject<object> = new Subject();
  private selectedUser$ = this.selectedUser.asObservable();

  private selectedUserChatId: Subject<number> = new Subject();
  private selectedUserChatId$ = this.selectedUserChatId.asObservable();
  constructor(private http: HttpClient) { }

  fetchUserList() {
    return this.http.get(`${BASE_URL}/onlineUsers`);
  }

  fetchMessages(payload) {
    return this.http.post(`${BASE_URL}/fetchMessages`, payload)
  }


  getSelectedUser() {
    return this.selectedUser$;
  }

  setSelectedUser(user) {
    this.selectedUser.next(user);
  }

  getUserChatId() {
    return this.selectedUserChatId$;
  }

  setUserChatId(chatId) {
    this.selectedUserChatId.next(chatId);
  }


}
