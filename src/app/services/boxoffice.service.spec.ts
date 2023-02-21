import { TestBed } from '@angular/core/testing';

import { BoxofficeService } from './boxoffice.service';

describe('BoxofficeService', () => {
  let service: BoxofficeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoxofficeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
