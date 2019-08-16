/** Angular Imported Modules */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Interfaces */
import { IMap } from '../interfaces/map.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  constructor(
    private http: HttpClient
  ) { }

  getBusFeed(): Observable<any> {
    console.log('Constructor', this.http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni').constructor);
    return this.http.get('http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni');
  }
}
