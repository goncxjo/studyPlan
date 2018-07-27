import { TestBed, inject } from '@angular/core/testing';

import { HeadquartersService } from './headquarters.service';

describe('HeadquartersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeadquartersService]
    });
  });

  it('should be created', inject([HeadquartersService], (service: HeadquartersService) => {
    expect(service).toBeTruthy();
  }));
});
