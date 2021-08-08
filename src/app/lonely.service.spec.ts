import { TestBed } from '@angular/core/testing';

import { LonelyService } from './lonely.service';

describe('LonelyService', () => {
  let service: LonelyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LonelyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
