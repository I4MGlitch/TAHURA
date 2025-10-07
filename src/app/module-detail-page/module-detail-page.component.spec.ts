import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleDetailPageComponent } from './module-detail-page.component';

describe('ModuleDetailPageComponent', () => {
  let component: ModuleDetailPageComponent;
  let fixture: ComponentFixture<ModuleDetailPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleDetailPageComponent]
    });
    fixture = TestBed.createComponent(ModuleDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
