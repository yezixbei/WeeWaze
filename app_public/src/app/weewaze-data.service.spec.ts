import { TestBed } from '@angular/core/testing';

import { WeewazeDataServiceService } from './weewaze-data-service.service';

describe('WeewazeDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeewazeDataServiceService = TestBed.get(WeewazeDataServiceService);
    expect(service).toBeTruthy();
  });
});
