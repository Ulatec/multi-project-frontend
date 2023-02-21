import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxofficeChartsComponent } from './boxoffice-charts.component';

describe('BoxofficeChartsComponent', () => {
  let component: BoxofficeChartsComponent;
  let fixture: ComponentFixture<BoxofficeChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxofficeChartsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxofficeChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
