import { TestBed, inject } from '@angular/core/testing';

import { DynamicTranslationService } from './dynamic-translation.service';

describe('DynamicTranslationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicTranslationService]
    });
  });

  it('should ...', inject([DynamicTranslationService], (service: DynamicTranslationService) => {
    expect(service).toBeTruthy();
  }));
});
