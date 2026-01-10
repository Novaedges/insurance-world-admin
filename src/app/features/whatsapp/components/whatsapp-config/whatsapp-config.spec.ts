import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappConfig } from './whatsapp-config';

describe('WhatsappConfig', () => {
  let component: WhatsappConfig;
  let fixture: ComponentFixture<WhatsappConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsappConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
