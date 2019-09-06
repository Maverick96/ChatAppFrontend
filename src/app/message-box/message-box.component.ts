import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MessagingService } from '../shared/services/messaging.service';
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
  currentPeerKey;
  isInitiator: boolean = false;
  showEmoji: boolean = false;

  constructor(private userService: UserService,
    private messagingService: MessagingService) { }

  @ViewChild('streamVideo') videoEle: ElementRef;
  @ViewChild('chatBody') chatBodyEle: ElementRef;
  @ViewChild('textInp') textInpEle: ElementRef;

  ngOnInit() {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    this.currentUserId = userData.userId;
    this.subscribeToSelectUser();
    this.subscribeToMessages();
    this.subscribeToPeerKey();
    console.log('Peer')
  }

  createPeerInstance() {

    navigator.getUserMedia({ audio: true, video: true }, stream => {
      this.peer1 = new SimplePeer({
        initiator: this.isInitiator,
        stream,
        trickle: false
      });
      console.log("yes", this.peer1);
      if (!this.isInitiator) {
        this.peer1.signal(this.currentPeerKey);
      }

      this.peer1.on('signal', data => {
        console.log("SIGNAL!!", data.type, this.isInitiator);
        if (data.type && this.isInitiator) {
          const payload = {
            key: data,
            receiverId: this.receiverUser['userId']
          };
          this.messagingService.sendPeerConnectionRequest(payload);
        }
        // else if (data.type) {
        //   this.peer1.signal(data);
        // }
      });

      this.peer1.on('data', data => {
        console.log("DATA!!!!!")
      })

      this.peer1.on('stream', streamData => {
        console.log("Stream started", this.videoEle.nativeElement.srcObject);
        this.videoEle.nativeElement.srcObject = streamData;
        this.videoEle.nativeElement.play();

      });

    }, err => {
      console.error("ERRROR!", err)
    })
  }




  connectPeer() {
    this.isInitiator = true;
    this.createPeerInstance();
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
      } else {
        this.messageList.push(msg);
      }
      this.scrollToBottom();
    })
  }

  subscribeToPeerKey() {
    this.peerKey$ = this.messagingService.receivePeerKey().subscribe(key => {
      console.log("Key Peer-----", key);
      this.isInitiator = false;
      this.currentPeerKey = key;
      this.createPeerInstance();
    })
  }

  addEmoji(event) {
    console.log("Event", event);
    this.message = this.message + event.emoji.native;
    this.toggleEmojiLayout();
    // this.textInpEle.nativeElement.focus();
  }

  toggleEmojiLayout() {
    this.showEmoji = !this.showEmoji;
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
  }
}
