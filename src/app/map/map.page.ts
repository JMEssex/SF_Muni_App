import { MapService } from './../services/map.service';
import { Component, OnInit } from '@angular/core';

/** Imported App Interfaces */
import { IMap } from '../interfaces/map.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.refreshTimer();
  }

  /**
   * #### RxJS Refresh Timer used to call the NEXTBUS Api Call.
   */
  refreshTimer() {
    // NOTE: Sets RxJS Refresh Rate at 15 seconds. First call after 1 second.
    const refreshRate = timer(1000, 15000);
    refreshRate.subscribe(tick => this.requestBusFeed());
  }

  /**
   * Method for calling getBusFeed() from the MapService.
   *
   * @returns JSON Bus Data using the `IMap` interface.
   */
  requestBusFeed() {
    this.mapService.getBusFeed().subscribe(
      (response: IMap) => console.log(response),
      error => console.log(error)
    );
  }
}
