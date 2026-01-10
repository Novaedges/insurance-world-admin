import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsOutbox } from './sms-outbox';

describe('SmsOutbox', () => {
  let component: SmsOutbox;
  let fixture: ComponentFixture<SmsOutbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsOutbox],
    }).compileComponents();

    fixture = TestBed.createComponent(SmsOutbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
