import { TestBed } from '@angular/core/testing';

import { DailyDataService } from './daily-data.service';

describe('DailyDataService', () => {
  let service: DailyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
