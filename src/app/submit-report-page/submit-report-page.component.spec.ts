import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReportPageComponent } from './submit-report-page.component';

describe('SubmitReportPageComponent', () => {
  let component: SubmitReportPageComponent;
  let fixture: ComponentFixture<SubmitReportPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitReportPageComponent]
    });
    fixture = TestBed.createComponent(SubmitReportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
