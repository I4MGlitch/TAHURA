import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogregPageComponent } from './logreg-page.component';

describe('LogregPageComponent', () => {
  let component: LogregPageComponent;
  let fixture: ComponentFixture<LogregPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogregPageComponent]
    });
    fixture = TestBed.createComponent(LogregPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
