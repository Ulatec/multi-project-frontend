import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyProtectedComponent } from './dummy-protected.component';

describe('DummyProtectedComponent', () => {
  let component: DummyProtectedComponent;
  let fixture: ComponentFixture<DummyProtectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DummyProtectedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DummyProtectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
