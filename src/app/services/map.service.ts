/** Imported Angular Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Imported App Modules */
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

/**
 * Service used for referencing `mapboxgl` and invoking `NextBus API` request methods.
 *
 * @export
 * @class MapService
 */
@Injectable({
  providedIn: 'root'
})
export class MapService {
  // * NOTE: Useing the reference of `mapboxgl` saves 670K from being loading into the component.
  // * NOTE: FIX: This is a Fix to `mapboxgl` because when importing the @types `mapboxgl.accessToken` becomes `read-only`
  /**
   * Global public property used to reference `mapboxgl`.
   *
   * @type {typeof mapboxgl}
   * @memberof MapService
   */
  public mapboxRef: typeof mapboxgl;

  /**
   * Creates an instance of `MapService`.
   *
   * @param {HttpClient} http Performs HTTP requests.
   * @memberof MapService
   */
  constructor(
    private http: HttpClient,
  ) {
    this.mapboxRef = mapboxgl;
    this.mapboxRef.accessToken = environment.mapbox.accessToken;
  }

  /**
   * Calls the `NextBus API` and returns the public JSON feed for all vechicle locations in `sf-muni`.
   * @dev Kept functionality for displaying all busses when `routeTag` is not added. (Currently Disabeled)
   *
   * @returns {Observable<any>}
   * @memberof DbService
   */
  getBusFeed(routeTag?: string): Observable<any> {
    if (routeTag) {
      return this.http.get(`http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=${routeTag}`);
    } else {
      return this.http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni');
    }
  }
}
