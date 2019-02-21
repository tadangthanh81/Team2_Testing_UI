import { TestBed } from '@angular/core/testing';

import { UploadserviceService } from './uploadservice.service';

describe('UploadserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadserviceService = TestBed.get(UploadserviceService);
    expect(service).toBeTruthy();
  });
});
