import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncStatus } from './sync-status';

describe('SyncStatus', () => {
  let component: SyncStatus;
  let fixture: ComponentFixture<SyncStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncStatus],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncStatus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
