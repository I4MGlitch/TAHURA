import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocializingSpotPageComponent } from './socializing-spot-page.component';

describe('SocializingSpotPageComponent', () => {
  let component: SocializingSpotPageComponent;
  let fixture: ComponentFixture<SocializingSpotPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocializingSpotPageComponent]
    });
    fixture = TestBed.createComponent(SocializingSpotPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
