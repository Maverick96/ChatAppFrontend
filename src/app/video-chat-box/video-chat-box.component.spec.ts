import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChatBoxComponent } from './video-chat-box.component';

describe('VideoChatBoxComponent', () => {
  let component: VideoChatBoxComponent;
  let fixture: ComponentFixture<VideoChatBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
