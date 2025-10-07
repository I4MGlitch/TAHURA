import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotPageComponent } from './chatbot-page.component';

describe('ChatbotPageComponent', () => {
  let component: ChatbotPageComponent;
  let fixture: ComponentFixture<ChatbotPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotPageComponent]
    });
    fixture = TestBed.createComponent(ChatbotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
