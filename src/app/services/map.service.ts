/** Angular Imported Modules */
import { Injectable } from '@angular/core';
/** Imported Angular Modules */
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // * NOTE: Useing the reference of `mapboxgl` saves 670K from being loading into the component.
  // * NOTE: FIX: This is a Fix to `mapboxgl` because when importing the @types `mapboxgl.accessToken` becomes `read-only`
  public mapboxRef: typeof mapboxgl;

  constructor(
    private http: HttpClient,
  ) {
    this.mapboxRef = mapboxgl;
    this.mapboxRef.accessToken = environment.mapbox.accessToken;
  }

  /**
   * Calls the `NextBus API` and returns the public JSON feed for all vechicle locations in `sf-muni`.
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
