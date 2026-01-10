import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelTraining } from './model-training';

describe('ModelTraining', () => {
  let component: ModelTraining;
  let fixture: ComponentFixture<ModelTraining>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelTraining],
    }).compileComponents();

    fixture = TestBed.createComponent(ModelTraining);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
