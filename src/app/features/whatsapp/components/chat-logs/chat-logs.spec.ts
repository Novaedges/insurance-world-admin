import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatLogs } from './chat-logs';

describe('ChatLogs', () => {
  let component: ChatLogs;
  let fixture: ComponentFixture<ChatLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatLogs],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatLogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
