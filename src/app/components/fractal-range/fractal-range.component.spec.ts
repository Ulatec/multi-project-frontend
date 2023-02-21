import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FractalRangeComponent } from './fractal-range.component';

describe('FractalRangeComponent', () => {
  let component: FractalRangeComponent;
  let fixture: ComponentFixture<FractalRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FractalRangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FractalRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
