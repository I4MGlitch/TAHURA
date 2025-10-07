import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangrovesDashboardPageComponent } from './mangroves-dashboard-page.component';

describe('MangrovesDashboardPageComponent', () => {
  let component: MangrovesDashboardPageComponent;
  let fixture: ComponentFixture<MangrovesDashboardPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MangrovesDashboardPageComponent]
    });
    fixture = TestBed.createComponent(MangrovesDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
