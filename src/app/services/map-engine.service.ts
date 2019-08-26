import { Injectable } from '@angular/core';
import { timer } from 'rxjs';

import { GeoJson, FeatureCollection } from '../builders/geo-json.builder';
import { MapService } from './map.service';
import { IBusMap } from '../interfaces/map.interface';

@Injectable({ providedIn: 'root' })
export class MapEngineService {
  mapRef: mapboxgl.Map = null;

  constructor(
    private mapService: MapService
  ) { }

  public engine() {
    this.buildMap();
  }

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

  public layerEngine(selectedRouteTag: string) {
    this.mapService.getBusFeed(selectedRouteTag).subscribe(((busses: IBusMap) => {
      this.createSource(selectedRouteTag);
      this.createLayer(selectedRouteTag);
      this.filterData(busses, selectedRouteTag);
    }));
  }

  private createSource(routeTag: string) {
    this.mapRef.addSource(`${routeTag}`, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
  }

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

  public removeSource(selectedRouteTag: string) {
    this.mapRef.removeLayer(selectedRouteTag);
    this.mapRef.removeSource(selectedRouteTag);
  }

  public refreshEngine(selectedRoutes: string[]) {
      const refreshRate = timer(1000, 15000);
      refreshRate.subscribe(tick => {
        if (selectedRoutes.length !== 0) {
          this.refreshData(selectedRoutes);
        }
      });
  }

  private refreshData(selectedRoutes: string[]) {
    selectedRoutes.forEach(routeTag => this.mapService.getBusFeed(routeTag).subscribe((busses: IBusMap) => {
      this.filterData(busses, routeTag);
    }));
  }
}
