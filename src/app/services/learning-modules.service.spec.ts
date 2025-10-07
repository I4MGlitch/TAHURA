import { TestBed } from '@angular/core/testing';

import { LearningModulesService } from './learning-modules.service';

describe('LearningModulesService', () => {
  let service: LearningModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningModulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
