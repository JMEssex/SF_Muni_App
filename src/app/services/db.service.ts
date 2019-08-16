/** Imported Angular Modules */
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** Imported App Interfaces */
import { IMap } from '../interfaces/map.interface';

@Injectable({providedIn: 'root'})
export class DbService {

  busses: IMap;

  constructor(
    private http: HttpClient,
  ) { }

  setBusList(data: IMap) {
    this.busses = data;
    console.log('this.busses:', this.busses);
  }
}
