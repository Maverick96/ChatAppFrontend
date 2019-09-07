import { TestBed } from '@angular/core/testing';

import { VideoCallService } from './video-call.service';

describe('VideoCallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoCallService = TestBed.get(VideoCallService);
    expect(service).toBeTruthy();
  });
});
