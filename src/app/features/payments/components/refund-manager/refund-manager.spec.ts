import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundManager } from './refund-manager';

describe('RefundManager', () => {
  let component: RefundManager;
  let fixture: ComponentFixture<RefundManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefundManager],
    }).compileComponents();

    fixture = TestBed.createComponent(RefundManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
