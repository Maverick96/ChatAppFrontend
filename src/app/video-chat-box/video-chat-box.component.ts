import { Component, OnInit, Input, OnDestroy, ElementRef, ViewChild, Inject } from '@angular/core';
import { MessagingService } from '../shared/services/messaging.service';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-video-chat-box',
  templateUrl: './video-chat-box.component.html',
  styleUrls: ['./video-chat-box.component.css']
})
export class VideoChatBoxComponent implements OnInit, OnDestroy {

  // @Input('peerKey') peerKey;
  // @Input('isInitiator') isInitiator: boolean;
  // @Input('receiverId') receiverId: number;

  @ViewChild('streamVideo') streamVideo: ElementRef;
  @ViewChild('selfVideo') selfVideo: ElementRef;

  constructor(private messagingService: MessagingService,
    private dialogRef: MatDialogRef<VideoChatBoxComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.peerKey = data['key'];
    this.isInitiator = data['isInitiator'];
    this.receiverId = data['receiverId']
    this.currentId = data['senderId'];
    this.caller = data['caller'];
  }
  receiverId: number;
  currentId: number;
  peerKey;
  caller: string;
  isInitiator: boolean;
  peer;
  peerKey$: Subscription;
  ngOnInit() {
    if (this.isInitiator) {
      this.subscribeToReceiverKey();
    }
    this.createPeerInstance();
  }

  subscribeToReceiverKey() {
    this.peerKey$ = this.messagingService.receivePeerKey().subscribe(data => {
      console.log("Key Peer-----", data, this.isInitiator);
      // connect to receiver if it is the initator!!
      this.peer.signal(data['key']);
    });
  }

  createSelfVideoSteam() {
    navigator.getUserMedia({ video: true }, stream => {
      // show self video
      this.selfVideo.nativeElement.srcObject = stream;
      this.selfVideo.nativeElement.play();
    }, err => {
      console.log("Error", err);
    })
  }

  createPeerInstance() {

    if (this.peer) {
      console.log("Destroying")
      this.peer.destroy();
    }
    // get media stream and use it to create the webrtc peer
    navigator.getUserMedia({ audio: true, video: true }, stream => {

      this.createSelfVideoSteam();
      // create peer
      this.peer = new SimplePeer({
        initiator: this.isInitiator,
        stream,
        trickle: false
      });
      console.log("Peer created!");

      // connect to initiator if you're the receiver
      if (!this.isInitiator) {
        console.log("Received request, now connecting")
        this.peer.signal(this.peerKey);
      }

      this.peer.on('signal', data => {
        console.log("SIGNAL!!", data.type, this.isInitiator);
        // create intiator connection 
        if (data.type === 'offer') {
          const payload = {
            key: data,
            receiverId: this.receiverId,
            senderId: this.currentId,
            isInitiator: true,
            caller: this.caller
          };
          this.messagingService.sendPeerConnectionRequest(payload);
        } else if (data.type === 'answer') {
          console.log("In receiver!")
          // this.receiverPeerKey = data;
          const payload = {
            key: data,
            receiverId: this.currentId,
            senderId: this.receiverId,
            isInitiator: false,
            caller: this.caller
          };
          this.messagingService.sendPeerConnectionRequest(payload);
        }
      });

      this.peer.on('connect', () => {
        console.log("Connected !!", this.isInitiator);
      });

      this.peer.on('disconnect', () => {
        console.log("Disconnected");
      });

      this.peer.on('stream', streamData => {
        console.log("Stream started", streamData);
        if (streamData) {
          this.streamVideo.nativeElement.srcObject = streamData;
          this.streamVideo.nativeElement.play();
        }

      });

    }, err => {
      console.error("ERRROR!", err)
    })
  }

  destroyVideoStream(videoElement) {
    console.log("In Destroy~");
    if (videoElement && videoElement.srcObject) {
      let stream = videoElement.srcObject;
      let tracks = stream.getTracks();
      if (tracks) {
        tracks.forEach(function (track) {
          track.stop();
        });
      }

      videoElement.srcObject = null;
    }
  }

  endVideoCall() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.peer) {
      this.peer.destroy();
    }

    if (this.peerKey$) {
      this.peerKey$.unsubscribe();
    }

    this.destroyVideoStream(this.streamVideo.nativeElement);
    this.destroyVideoStream(this.selfVideo.nativeElement);
  }

}
