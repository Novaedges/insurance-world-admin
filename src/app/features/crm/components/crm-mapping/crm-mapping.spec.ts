import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmMapping } from './crm-mapping';

describe('CrmMapping', () => {
  let component: CrmMapping;
  let fixture: ComponentFixture<CrmMapping>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrmMapping],
    }).compileComponents();

    fixture = TestBed.createComponent(CrmMapping);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
