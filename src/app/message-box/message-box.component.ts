import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MessagingService } from '../shared/services/messaging.service';
import { VideoCallService } from '../shared/services/video-call.service';
import { AlertService } from '../shared/services/alert.service';
// import { Peer } from 'simple-peer';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit, OnDestroy {
  getSelectedUser$: Subscription;
  receiveMsg$: Subscription;
  fetchMessage$: Subscription;
  peerKey$: Subscription;

  message: string = '';
  messageList: object[] = [];
  receiverUser: object = {};
  currentUserId: number;
  chatId: number;
  peer1;
  initiatorPeerKey;
  receiverPeerKey;

  isInitiator: boolean = false;
  showEmoji: boolean = false;
  isIncomingCall: boolean = false;

  constructor(private userService: UserService,
    private messagingService: MessagingService,
    private videoCallService: VideoCallService,
    private alertService: AlertService) { }

  @ViewChild('chatBody') chatBodyEle: ElementRef;
  @ViewChild('textInp') textInpEle: ElementRef;

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    this.currentUserId = userData.userId;
    this.subscribeToSelectUser();
    this.subscribeToMessages();
  }

  subscribeToSelectUser() {
    this.getSelectedUser$ = this.userService.getSelectedUser().subscribe(user => {
      console.log("User", user);
      this.receiverUser = user;
      // fetch messages and get ChatId
      const payload = {
        user1: this.currentUserId,
        user2: this.receiverUser['userId']
      }
      this.fetchMessage$ = this.userService.fetchMessages(payload).subscribe(res => {
        console.log(res);
        this.messageList = res['result'];
        this.chatId = res['chatId'];
        this.userService.setUserChatId(this.chatId);
        this.scrollToBottom();
      }, err => {
        console.error(err);
        this.alertService.showAlert("Message could not be fetched!");
        this.chatId = null;
        this.messageList = [];
      })
    });
  }

  scrollToBottom() {
    console.log("Scroll!");
    this.chatBodyEle.nativeElement.scrollTop = this.chatBodyEle.nativeElement.scrollHeight;
  }

  onEnterMessage() {
    console.log("Message entered!", this.message, this.chatId, this.receiverUser['userId']);
    this.toggleEmojiLayout();
    this.messageList.push({
      message: this.message,
      senderId: this.currentUserId
    });
    this.scrollToBottom();
    // send msg to server
    this.messagingService.sendMessage({
      msg: this.message,
      index: this.messageList.length - 1,
      receiverId: this.receiverUser['userId'],
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
      } else if (msg['senderId'] === this.receiverUser['userId']) { // push msg only if you're in the receiver's chat window
        this.messageList.push(msg);
      }
      this.scrollToBottom();
    })
  }



  addEmoji(event) {
    console.log("Event", event);
    this.message = this.message + event.emoji.native;
    // this.textInpEle.nativeElement.focus();
  }

  toggleEmojiLayout() {
    this.showEmoji = !this.showEmoji;
  }

  initiateVideoCall() {
    console.log("Initiate Video CAll")
    this.videoCallService.setSelectedUser({
      senderId: this.currentUserId,
      receiverId: this.receiverUser['userId'],
    });
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

    if (this.peerKey$) {
      this.peerKey$.unsubscribe();
    }

    if (this.peer1) {
      console.log("Destroying")
      this.peer1.destroy();
    }
  }
}
