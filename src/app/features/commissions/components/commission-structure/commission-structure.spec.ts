import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionStructure } from './commission-structure';

describe('CommissionStructure', () => {
  let component: CommissionStructure;
  let fixture: ComponentFixture<CommissionStructure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionStructure],
    }).compileComponents();

    fixture = TestBed.createComponent(CommissionStructure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
