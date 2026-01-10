import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsConfig } from './sms-config';

describe('SmsConfig', () => {
  let component: SmsConfig;
  let fixture: ComponentFixture<SmsConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
