import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { MapService } from './map.service';
import { IBusMap } from '../interfaces/map.interface';
import { testData } from '../../data/test-data';

describe('MapService', () => {
  let mapService: MapService;

  beforeEach(() => {
    mapService = new MapService(null);
  });

  it('should be created', () => {
    expect(mapService).toBeTruthy();
  });

  describe('calling getBusFeed()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
        ],
        providers: [MapService]
      });
      mapService = TestBed.get(MapService);
    });

    it('should return an observable list (busses as IBusMap)', async(
      inject( [HttpClient], (http: HttpClient) => {

        // GIVEN - Mock service dependencies with expected value
        spyOn(http, 'get').and.returnValue(of(testData));

        // WHEN - Subscribe to observable returned by service method
        mapService.getBusFeed().subscribe((busses: IBusMap) => {

          // THEN - Assert result matches expected value
          expect(busses).toBe(testData);
        });
      })
    ));
  });
});
