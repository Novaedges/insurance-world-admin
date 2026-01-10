import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutReconciliation } from './payout-reconciliation';

describe('PayoutReconciliation', () => {
  let component: PayoutReconciliation;
  let fixture: ComponentFixture<PayoutReconciliation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutReconciliation],
    }).compileComponents();

    fixture = TestBed.createComponent(PayoutReconciliation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
