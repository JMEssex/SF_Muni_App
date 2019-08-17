// Imported Angular Modules
import { Component, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs';

/** Imported App Services */
import { DbService } from '../services/db.service';
import { MapService } from '../services/map.service';

/** Imported App Interfaces */
import { IBusMap } from '../interfaces/map.interface';
import { GeoJson, FeatureCollection } from '../builders/geo-json.builder';


/**
 *  `MapPage` for rendering the app's map and bus markers.
 *
 * @export
 * @class MapPage
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})

export class MapPage implements AfterViewInit {
  /// Map Data
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 37.75;
  lng = -122.41;

  /// Marker Data
  source: mapboxgl.AnySourceImpl;

  /**
   * Creates an instance of MapPage.
   *
   * @param {MapService} mapService Service for methods involving `Mapboxgl` api calls.
   * @param {DbService} dbService Service for handeling `NextBus` realtime data.
   * @memberof MapPage
   */
  constructor(
    private mapService: MapService,
    protected dbService: DbService,
  ) { }

  // NOTE: Building with `OnInit` loads too quickly for the map build.
  ngAfterViewInit() {
    this.buildMap();
  }

  /**
   * Method to creat the `mapboxgl.Map` element and to base map styles.
   *
   * @memberof MapPage
   */
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

    // NOTE: `load` occurs after all `mapboxgl.Map` data has been rendered.
    this.map.on('load', (event: any) => {
      this.mapLayerInit();
      this.refreshTimer();
    });

    // Renders the map's navigation controls on the map's UI view.
    this.map.addControl(new this.mapService.mapboxRef.NavigationControl());
  }

  /**
   * RxJS Refresh Timer used to call the NEXTBUS Api Call.
   */
  refreshTimer() {
    // NOTE: Sets RxJS Refresh Rate at 15 seconds. First call after 1 second.
    const refreshRate = timer(1000, 15000);
    refreshRate.subscribe(tick => this.requestBusFeed());
  }

  /**
   * Method for calling `getBusFeed()` from the `MapService`.
   *
   * @returns JSON Bus Data using the `IBusMap` interface.
   */
  requestBusFeed() {
    this.mapService.getBusFeed().subscribe(
      (response: IBusMap) => {
        this.dbService.setBusList(response);
        this.createBusMarkers(this.dbService.busses);
      },
      error => console.log(error)
    );
  }

  /**
   * Method for initalizing the map's layers for bus data source to be displayed on.
   *
   * @memberof MapPage
   */
  mapLayerInit() {
    // NOTE: Adds a new/blank source of data with the `id="busLocation".
    this.map.addSource('busLocation', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });

    // NOTE: Adds the layer on top of the map for displaying the `busLocation` data set.
    this.map.addLayer({
      id: 'busLocation',
      source: 'busLocation',
      type: 'symbol',
      layout: {
        'text-field': '{message}',
        'text-size': 12,
        'text-transform': 'uppercase',
        'icon-image': 'bus',
        'icon-size': 2,
        'text-offset': [0, 1.5]
      },
      paint: {
        'text-color': '#f16624',
        'text-halo-color': '#fff',
        'text-halo-width': 2
      }
    });

    // NOTE: Binds `busLocation` source options as well as `busLocation` map layers to `this.source` property.
    this.source = this.map.getSource('busLocation');
    console.log('Source:', this.source);
  }

  /**
   * Method for parsing through API bus data and setting the data to `this.source` as a `FeatureCollection`.
   *
   * @param {IBusMap} busses NextBus API raw response JSON data.
   * @memberof MapPage
   */
  createBusMarkers(busses: IBusMap) {
    const bussesArray = busses.vehicle.reduce((acc: any, cur) => {
      const coordinates = [parseFloat(cur.lon), parseFloat(cur.lat)];
      const newMarker = new GeoJson(coordinates, { message: `Bus# ${cur.id}-(${cur.routeTag})` });
      acc.push(newMarker);
      return acc;
    }, []);
    console.log('BussesArray', bussesArray);
    const data = new FeatureCollection(bussesArray);
    console.log('data:', data);
    this.source.setData(data);
  }
}
