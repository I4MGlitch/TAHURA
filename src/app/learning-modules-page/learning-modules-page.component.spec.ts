import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningModulesPageComponent } from './learning-modules-page.component';

describe('LearningModulesPageComponent', () => {
  let component: LearningModulesPageComponent;
  let fixture: ComponentFixture<LearningModulesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningModulesPageComponent]
    });
    fixture = TestBed.createComponent(LearningModulesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
