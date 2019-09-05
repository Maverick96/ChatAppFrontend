import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService) { }
  userList: any[] = [];
  totalUsers: number = 0;
  userList$: Subscription;
  selectedUserChatId$: Subscription;
  selectedUserIndex: number;
  ngOnInit() {
    this.fetchUserList();
    this.getUserChatId();
  };

  fetchUserList() {
    this.userList$ = this.userService.fetchUserList().subscribe(data => {
      if (data['result']) {
        this.userList = data['result'];
        this.totalUsers = data['total'];
      }
    }, err => {
      console.log("Error", err);
    });

  }

  onSelectUser(index) {
    this.selectedUserIndex = index;
    console.log("CLICKED!", index)
    this.userService.setSelectedUser(this.userList[index]);
  }

  getUserChatId() {
    this.selectedUserChatId$ = this.userService.getUserChatId().subscribe(chatId => {
      this.userList[this.selectedUserIndex].chatId = chatId;
      console.log("CHAT ID", chatId);
    });
  }

  ngOnDestroy() {
    if (this.userList$) {
      this.userList$.unsubscribe();
    }

    if (this.selectedUserChatId$) {
      this.selectedUserChatId$.unsubscribe();
    }
  }

}
