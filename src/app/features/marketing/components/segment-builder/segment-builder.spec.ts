import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentBuilder } from './segment-builder';

describe('SegmentBuilder', () => {
  let component: SegmentBuilder;
  let fixture: ComponentFixture<SegmentBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SegmentBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SegmentBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
