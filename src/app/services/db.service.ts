/** Imported Angular Modules */
import { Injectable } from '@angular/core';

/** Imported App Interfaces */
import { IBusMap } from '../interfaces/map.interface';

@Injectable({providedIn: 'root'})
export class DbService {
  /**
   * Public property for setting raw `NextBus API` response data.
   */
  public busses: IBusMap;

  constructor() { }

  /**
   * Takes the raw `NextBus API` response data and sets it to the public `busses` property consumption.
   *
   * @param {IBusMap} data
   * @memberof DbService
   */
  public setBusList(data: IBusMap) {
    this.busses = data;
    console.log('this.busses:', this.busses);
  }
}
