import { MapService } from '../services/map.service';
import { MapEngineService } from './map-engine.service';

import { testData } from '../../data/test-data';
import { of } from 'rxjs';

describe('MapEngineService', () => {
  let mapService;
  let mapEngineService;
  beforeEach(() => {
    mapService = new MapService(null);
    mapEngineService = new MapEngineService(mapService);
  });

  it('should be created', () => {
    expect(mapEngineService).toBeTruthy();
  });


  describe('calling layerEngine()', () => {
    it('should get a (response as IBusMap) from service', () => {
      spyOn(mapService, 'getBusFeed').and.returnValue(of({testData}));
      const createSourceSpy = spyOn(mapEngineService, 'createSource');
      const createLayerSpy = spyOn(mapEngineService, 'createLayer');
      const filterDataSpy = spyOn(mapEngineService, 'filterData');

      mapEngineService.layerEngine('N');

      expect(createSourceSpy).toHaveBeenCalled();
      expect(createLayerSpy).toHaveBeenCalled();
      expect(filterDataSpy).toHaveBeenCalled();
    });
  });
});
