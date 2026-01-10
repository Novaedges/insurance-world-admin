import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalDashboard } from './renewal-dashboard';

describe('RenewalDashboard', () => {
  let component: RenewalDashboard;
  let fixture: ComponentFixture<RenewalDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewalDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(RenewalDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
