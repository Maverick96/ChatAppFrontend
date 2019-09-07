import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDrawer, MatDialogConfig, MatDialog } from '@angular/material';
import { VideoCallService } from '../shared/services/video-call.service';
import { Subscription } from 'rxjs';
import { MessagingService } from '../shared/services/messaging.service';
import { VideoChatBoxComponent } from '../video-chat-box/video-chat-box.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('callerTune') callerTune: ElementRef;
  constructor(private videoCallService: VideoCallService,
    private socketService: MessagingService,
    private dialogService: MatDialog) {
    const userData = JSON.parse(localStorage.getItem('user-data'));
    if (userData) {
      this.caller = userData['name'];
    }
    console.log("CAller!", this.caller);
  }

  userDataForVideo$: Subscription;
  initiatorData$: Subscription;
  peerKeyFromServer$: Subscription;
  closeDialog$: Subscription;

  isIncomingCall: boolean = false;
  initData;
  caller: string;
  ngOnInit() {
    // open nav by default
    this.drawer.open();
    this.subscribeToPeerKeyFromServer();
    this.subscribeToInitatorData();
    this.subscribeToUserData();
    this.subscribeToDialogBox();
  }

  openVideoBox(data) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = data;
    dialogConfig.height = "80vh";
    dialogConfig.width = "80vw";
    this.dialogService.open(VideoChatBoxComponent, dialogConfig);

  }

  acceptCall() {
    this.openVideoBox(this.initData);
    this.isIncomingCall = false;
    this.stopCallerTune()
  }

  declineCall() {
    console.log("Decline");
    this.resetValues();
  }

  subscribeToDialogBox() {
    this.closeDialog$ = this.dialogService.afterAllClosed.subscribe(data => {
      this.resetValues();
    });
  }

  subscribeToUserData() {
    this.userDataForVideo$ = this.videoCallService.getSelectedUser().subscribe(userData => {
      //open dialog here for initiator
      console.log("User Data", userData);
      if (userData['receiverId'] && userData['senderId']) {
        const data = {
          key: undefined,
          isInitiator: true,
          receiverId: userData['receiverId'],
          senderId: userData['senderId'],
          caller: this.caller
        };
        this.openVideoBox(data);
      }
    })
  }

  subscribeToInitatorData() {
    this.initiatorData$ = this.videoCallService.getInitiatorData().subscribe(initData => {
      console.log("INIT Data", initData);
      // open video dialog for receiver, so set initiator as false
      if (initData['key']) {
        this.caller = initData['caller'];
        this.isIncomingCall = true;
        initData['isInitiator'] = false;
        this.initData = initData;
        this.callerTune.nativeElement.play();
      }
    })
  }

  subscribeToPeerKeyFromServer() {
    this.peerKeyFromServer$ = this.socketService.receivePeerKey().subscribe(data => {
      // connect to receiver if it is the initator!!
      if (data['isInitiator']) {
        this.videoCallService.setInitiatorData(data);
      } else if (data['isInitiator'] === false) {
        this.videoCallService.setReceiverData(data);
      }
    })
  }

  resetValues() {
    this.stopCallerTune();
    this.initData = {};
    this.isIncomingCall = false;
    this.videoCallService.setSelectedUser({});
    this.videoCallService.setInitiatorData({});

  }

  stopCallerTune() {
    this.callerTune.nativeElement.pause();
    this.callerTune.nativeElement.currentTime = 0;
  }

  ngOnDestroy() {
    if (this.userDataForVideo$) {
      this.userDataForVideo$.unsubscribe();
    }

    if (this.peerKeyFromServer$) {
      this.peerKeyFromServer$.unsubscribe();
    }

    if (this.initiatorData$) {
      this.initiatorData$.unsubscribe();
    }

    if (this.closeDialog$) {
      this.closeDialog$.unsubscribe();
    }

  }

}
