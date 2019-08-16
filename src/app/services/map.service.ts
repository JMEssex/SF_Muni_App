/** Angular Imported Modules */
import { Injectable } from '@angular/core';
/** Imported Angular Modules */
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    private http: HttpClient,
  ) { }

  getBusFeed(): Observable<any> {
    return this.http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni');
  }
}
