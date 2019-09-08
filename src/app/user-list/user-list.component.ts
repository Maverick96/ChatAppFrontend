import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../shared/services/login.service';
import { Router } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private alertService: AlertService) { }
  userList: any[] = [];
  totalUsers: number = 0;
  userList$: Subscription;
  logOut$: Subscription;

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
      this.alertService.showAlert("User list could not be fetched!");
      console.log("Error", err);
    });

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
        this.alertService.showAlert("Logout failed");
      }
    }, err => {
      this.alertService.showAlert("Logout failed");
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
