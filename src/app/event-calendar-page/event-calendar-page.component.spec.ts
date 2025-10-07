import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCalendarPageComponent } from './event-calendar-page.component';

describe('EventCalendarPageComponent', () => {
  let component: EventCalendarPageComponent;
  let fixture: ComponentFixture<EventCalendarPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCalendarPageComponent]
    });
    fixture = TestBed.createComponent(EventCalendarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
