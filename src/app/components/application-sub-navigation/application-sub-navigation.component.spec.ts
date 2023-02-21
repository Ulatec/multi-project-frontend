import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSubNavigationComponent } from './application-sub-navigation.component';

describe('ApplicationSubNavigationComponent', () => {
  let component: ApplicationSubNavigationComponent;
  let fixture: ComponentFixture<ApplicationSubNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationSubNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationSubNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
