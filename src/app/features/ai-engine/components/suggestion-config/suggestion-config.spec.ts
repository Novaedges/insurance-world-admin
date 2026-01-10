import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionConfig } from './suggestion-config';

describe('SuggestionConfig', () => {
  let component: SuggestionConfig;
  let fixture: ComponentFixture<SuggestionConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestionConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestionConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
