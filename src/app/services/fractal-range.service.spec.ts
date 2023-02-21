import { TestBed } from '@angular/core/testing';

import { FractalRangeService } from './fractal-range.service';

describe('FractalRangeService', () => {
  let service: FractalRangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FractalRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
