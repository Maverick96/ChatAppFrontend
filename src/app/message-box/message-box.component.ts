import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MessagingService } from '../shared/services/messaging.service';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit, OnDestroy {
  getSelectedUser$: Subscription;
  receiveMsg$: Subscription;
  fetchMessage$: Subscription;

  message: string = '';
  messageList: object[] = [];
  receiverUserId: number;
  currentUserId: number;
  chatId: number;
  constructor(private userService: UserService,
    private messagingService: MessagingService) { }

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    this.currentUserId = userData.userId;
    this.subscribeToSelectUser();
    this.subscribeToMessages();
  }

  subscribeToSelectUser() {
    this.getSelectedUser$ = this.userService.getSelectedUser().subscribe(user => {
      console.log("User", user);
      this.receiverUserId = user['userId'];
      // fetch messages and get ChatId
      const payload = {
        user1: this.currentUserId,
        user2: this.receiverUserId
      }
      this.fetchMessage$ = this.userService.fetchMessages(payload).subscribe(res => {
        console.log(res);
        this.messageList = res['result'];
        this.chatId = res['chatId'];
        this.userService.setUserChatId(this.chatId);
      }, err => {
        console.error(err);
        this.chatId = null;
        this.messageList = [];
      })
    });
  }

  onEnterMessage() {
    console.log("Message entered!", this.message, this.chatId, this.receiverUserId);
    this.messageList.push({
      msg: this.message,
      userId: this.currentUserId
    });
    // send msg to server
    this.messagingService.sendMessage({
      msg: this.message,
      index: this.messageList.length - 1,
      receiverId: this.receiverUserId,
      chatId: this.chatId,
      senderId: this.currentUserId
    });
    this.message = '';
  }

  subscribeToMessages() {
    this.receiveMsg$ = this.messagingService.receiveMessages().subscribe(msg => {
      console.log("received", msg);
      if (msg && msg.sentiment) {
        this.messageList[msg.index]['sentiment'] = msg.sentiment
      } else {
        this.messageList.push(msg);
      }
    })
  }

  ngOnDestroy() {
    if (this.getSelectedUser$) {
      this.getSelectedUser$.unsubscribe();
    }

    if (this.fetchMessage$) {
      this.fetchMessage$.unsubscribe();
    }

    if (this.receiveMsg$) {
      this.receiveMsg$.unsubscribe();
    }
  }
}
