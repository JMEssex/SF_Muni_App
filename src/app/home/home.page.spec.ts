import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapService } from './../services/map.service';
import { HomePage } from './home.page';
import { MapEngineService } from '../services/map-engine.service';

describe('HomePage', () => {
  let component: HomePage;
  let mapEngineService: MapEngineService;

  beforeEach(() => {
    mapEngineService = new MapEngineService(null);
    component = new HomePage(mapEngineService);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngAfterViewInit()', () => {
    const searchSpy = spyOn(component, 'searchBarInit');
    const engineSpy = spyOn(mapEngineService, 'engine');
    const refreshSpy = spyOn(mapEngineService, 'refreshEngine');
    component.ngAfterViewInit();

    expect(searchSpy).toHaveBeenCalled();
    expect(engineSpy).toHaveBeenCalled();
    expect(refreshSpy).toHaveBeenCalled();
  });

  describe('calling addRoutePill()', () => {
    beforeEach(() => {
      spyOn(mapEngineService, 'layerEngine');
    });

    it('should add a (route.tag as string) to routePills', () => {
      component.routePills = [];
      component.addRoutePill({ tag: 'N' });
      expect(component.routePills).toContain('N');
    });

    it('should not add more than 3 length to routePills array', () => {
      component.routePills = ['1', '6', 'N'];
      component.addRoutePill({ tag: '8' });
      expect(component.routePills.length).toEqual(3);
      expect(component.routePills).toEqual(['1', '6', 'N']);
    });

    it('should not push the same (route.tag as string) more than once', () => {
      component.routePills = ['N', '6'];
      component.addRoutePill({ tag: 'N' });
      expect(component.routePills.length).toEqual(2);
      expect(component.routePills).toEqual(['N', '6']);
    });
  });

  describe('calling removeRoutePill()', () => {
    beforeEach(() => {
      spyOn(mapEngineService, 'removeSource');
    });

    it('should remove a tag from routePills Array', () => {
      component.routePills = ['1', '6', 'N'];
      component.removeRoutePill('6');
      expect(component.routePills).toEqual(['1', 'N']);
    });
  });
});
