import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignWorkflow } from './campaign-workflow';

describe('CampaignWorkflow', () => {
  let component: CampaignWorkflow;
  let fixture: ComponentFixture<CampaignWorkflow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignWorkflow],
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignWorkflow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
