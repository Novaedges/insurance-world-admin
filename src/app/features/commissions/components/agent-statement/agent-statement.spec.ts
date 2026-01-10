import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentStatement } from './agent-statement';

describe('AgentStatement', () => {
  let component: AgentStatement;
  let fixture: ComponentFixture<AgentStatement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentStatement],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentStatement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
