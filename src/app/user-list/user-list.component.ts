import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../shared/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private loginService: LoginService,
    private router: Router) { }
  userList: any[] = [];
  totalUsers: number = 0;
  userList$: Subscription;
  logOut$: Subscription;

  selectedUserChatId$: Subscription;
  selectedUserIndex: number;
  ngOnInit() {
    console.log("USer List")
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

  videoCall() {
    console.log("Video Call!");
  }

  onSelectUser(index) {
    if (this.selectedUserIndex === index) {
      return;
    }
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

  logoutUser() {
    this.logOut$ = this.loginService.logout().subscribe(res => {
      if (res['success']) {
        localStorage.clear();
        this.router.navigate(['login']);
      } else {
        // show alert
      }
    })
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
