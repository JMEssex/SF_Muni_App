import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

import { GeoJson, FeatureCollection } from '../builders/geo-json.builder';
import { MapService } from './map.service';
import { IBusMap } from '../interfaces/map.interface';

@Injectable({ providedIn: 'root' })
export class MapEngineService {
  /**
   * Property for referenceing instance of `mapboxgl.Map`.
   * @dev Initial value set to `null` to execute first `engine()` call on `App` load.
   *
   * @type {mapboxgl.Map}
   * @memberof MapEngineService
   */
  mapRef: mapboxgl.Map = null;

  /**
   * Creates an instance of MapEngineService.
   *
   * @param {MapService} mapService Service used for referencing `mapboxgl` and invoking `NextBus API` request methods.
   * @memberof MapEngineService
   */
  constructor(
    private mapService: MapService
  ) { }

  /**
   * Init engine method for building the `mapboxgl` map.
   *
   * @fires buildMap()
   * @memberof MapEngineService
   */
  public engine() {
    this.buildMap();
  }

  /**
   * Private method for building the map and applying attributes, resizing the map on `dataloading` event, as well as adding navigation to top.
   *
   * @private
   * @memberof MapEngineService
   */
  private buildMap() {
    if (!this.mapRef) {
      this.mapRef = new this.mapService.mapboxRef.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12,
        center: [-122.41, 37.75],
      });

      this.mapRef.on('dataloading', () => {
        this.mapRef.resize();
      });

      // Renders the map's navigation controls on the map's UI view.
      this.mapRef.addControl(new this.mapService.mapboxRef.NavigationControl());
    }
  }

  /**
   * Engine Method for executing map source, map layers, and data filtering from `NextBus API` response.
   *
   * @fires createSource()
   * @fires createLayer()
   * @fires filterData()
   * @param {string} selectedRouteTag String parameter representing the selected route tag used to invoke function.
   * @memberof MapEngineService
   */
  public layerEngine(selectedRouteTag: string) {
    this.mapService.getBusFeed(selectedRouteTag).subscribe(((busses: IBusMap) => {
      this.createSource(selectedRouteTag);
      this.createLayer(selectedRouteTag);
      this.filterData(busses, selectedRouteTag);
    }));
  }

  /**
   * Private Method for creating a source on the map object.
   *
   * @private
   * @param {string} routeTag String parameter representing the route tag used to invoke function.
   * @memberof MapEngineService
   */
  private createSource(routeTag: string) {
    this.mapRef.addSource(`${routeTag}`, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
  }

  /**
   * Private Method for creating a Layer on the map object and determining how it will be displayed to the user.
   *
   * @private
   * @param {string} routeTag String parameter representing the route tag used to invoke function.
   * @memberof MapEngineService
   */
  private createLayer(routeTag: string) {
    // Add a layer method
    this.mapRef.addLayer({
      id: `${routeTag}`,
      source: `${routeTag}`,
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
  }

  /**
   * Private Method for filtering `IBusMap` object, converting the data into a `GeoJson` array, and setting the data on the approperate source id based on the `routeTag`.
   *
   * @private
   * @param {IBusMap} busses Object containing location response object from `NextBus API`.
   * @param {string} routeTag String parameter representing the route tag used to invoke function.
   * @memberof MapEngineService
   */
  private filterData(busses: IBusMap, routeTag: string) {
    const bussesArray: GeoJson[] = busses.vehicle.reduce((acc: GeoJson[], cur) => {
      const coordinates = [parseFloat(cur.lon), parseFloat(cur.lat)];
      const newMarker = new GeoJson(coordinates, { message: `Bus# ${cur.id}-(${cur.routeTag})` });
      acc.push(newMarker);
      return acc;
    }, []);
    if (!this.mapRef.getSource(routeTag)) {
      this.createSource(routeTag);
      this.createLayer(routeTag);
    }
    const source: any = this.mapRef.getSource(routeTag); // * NOTE: Typings issue so used <any>
    const data = new FeatureCollection(bussesArray);
    source.setData(data);
  }

  /**
   * Engine Method for removing a selected route from the map object.
   *
   * @fires mapRef.removeLayer()
   * @fires mapRef.removeSource()
   * @param {string} selectedRouteTag String parameter representing the selected route tag used to invoke function.
   * @memberof MapEngineService
   */
  public removeSource(selectedRouteTag: string) {
    this.mapRef.removeLayer(selectedRouteTag);
    this.mapRef.removeSource(selectedRouteTag);
  }

  /**
   * Engine Method for executing the refresh of the bus location data.
   * @dev `refreshRate` timer is set to 15000ms (15 seconds).
   *
   * @param {string[]} selectedRoutes Array parameter representing the selected route's tag as strings used to invoke function.
   * @memberof MapEngineService
   */
  public refreshEngine(selectedRoutes: string[]) {
      const refreshRate = timer(1000, 15000);
      refreshRate.subscribe(tick => {
        if (selectedRoutes.length !== 0) {
          this.refreshData(selectedRoutes);
        }
      });
  }

  /**
   * Private Method for subscribing to the `NextBus API` data and invoking `filterData()` to return a new `GeoJson` array.
   *
   * @private
   * @fires filterData()
   * @param {string[]} selectedRoutes Array parameter representing the selected route's tag as strings used to invoke function.
   * @memberof MapEngineService
   */
  private refreshData(selectedRoutes: string[]) {
    selectedRoutes.forEach(routeTag => this.mapService.getBusFeed(routeTag).subscribe((busses: IBusMap) => {
      this.filterData(busses, routeTag);
    }));
  }
}
