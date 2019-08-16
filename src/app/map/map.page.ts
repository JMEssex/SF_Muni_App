import { Component, OnInit, AfterViewInit } from '@angular/core';

import { DbService } from './../services/db.service';
import { MapService } from './../services/map.service';

/** Imported App Interfaces */
import { IMap } from '../interfaces/map.interface';
import { timer } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  constructor(
    private mapService: MapService,
    protected dbService: DbService,
  ) { }

  ngOnInit() {
    this.refreshTimer();
  }

  ngAfterViewInit() {
    this.buildMap();
  }

  buildMap() {
    // Creating new Mapbox Instance. Key of `container` binds value `map` instance to `id="map"` in the template.
    this.map = new this.mapService.mapboxRef.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat],
    });

    // * NOTE: On initialization of the map, `.resize()` is called to fit parent view.
    this.map.on('dataloading', (event: any) => {
      this.map.resize();
    });

    this.map.addControl(new this.mapService.mapboxRef.NavigationControl());
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
      (response: IMap) => this.dbService.setBusList(response),
      error => console.log(error)
    );
  }
}
