import { TestBed } from '@angular/core/testing';

import { MapEngineService } from './map-engine.service';

describe('MapEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapEngineService = TestBed.get(MapEngineService);
    expect(service).toBeTruthy();
  });
});
