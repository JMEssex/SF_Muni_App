import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

import { routeList } from '../../data/route-list';
import { MapEngineService } from '../services/map-engine.service';
import { IBusRouteList, IRouteDetail } from './../interfaces/map.interface';

/**
 * `HomePage` for rendering the app's map and bus markers and footer section.
 *
 * @export
 * @class HomePage
 * @implements {AfterViewInit}
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  /**
   * Property referencing instance of `IonSearchbar` to manipulate the shadow-dom.
   *
   * @type {IonSearchbar}
   */
  @ViewChild('searchBar', { static: true }) searchBar: IonSearchbar;

  /**
   * Property reference of `(routeList as IBusRouteList)` object.
   *
   * @type {IBusRouteList}
   */
  routes: IBusRouteList = routeList;

  /**
   * Array used for search bar filtering containing `IRouteDetail` objects.
   *
   * @type {IRouteDetail[]}
   */
  filteredBusList: IRouteDetail[];

  /**
   * Array containing selected `routeTags` to be displayed as pills.
   *
   * @type {string[]}
   */
  routePills: string[] = ['1', '6', 'N'];

  /**
   * Creates an instance of `HomePage`.
   *
   * @param {MapEngineService} mapEngineService Engine Service handeling all data and map manipulation.
   */
  constructor(
    private mapEngine: MapEngineService,
  ) { }

  /**
   * `ngAfterViewInit()` method for initalizing map view and search bar view.
   *
   * @fires searchBarInit()
   * @fires mapEngine.engine()
   * @fires mapEngine.refreshEngine()
   * @memberof HomePage
   */
  ngAfterViewInit() {
    this.searchBarInit();
    this.mapEngine.engine();
    this.mapEngine.refreshEngine(this.routePills);
  }

  /**
   * On `ionChange` emit event, method subscribes and sets response object to `filteredBusList` array.
   * @dev If search bar is empty, search filter will set `filteredBusList` to an empty array.
   *
   * @memberof HomePage
   */
  searchBarInit() {
    this.searchBar.ionChange.subscribe((response) => {
      if (response.detail.value !== '') {
        this.filteredBusList = this.routes.route.filter(route => route.tag.includes(response.detail.value));
      } else {
        this.filteredBusList = [];
      }
    });
  }

  /**
   * Method for pushing `(route.tag as string)` to `routePills` array and invoking `mapEngine.layerEngine()` engine methods.
   * @dev Will not allow duplicate nor more than 3 `route.tag` to be added to the `routePills` array.
   *
   * @param {IRouteDetail} route Route object containing keys of `title` and `tag`.
   * @memberof HomePage
   */
  addRoutePill(route: IRouteDetail) {
    if (this.routePills.length < 3 && this.routePills.indexOf(route.tag) === -1) {
      this.routePills.push(route.tag);
      this.mapEngine.layerEngine(route.tag);
    }
  }

  /**
   * Method for removing `(routeTag as string)` from `routePills` array and invoking `mapEngine.removeSource()` engine methods.
   *
   * @param {string} routeTag String representing selected bus route's `tag`
   * @memberof HomePage
   */
  removeRoutePill(routeTag: string) {
    this.routePills.splice(this.routePills.indexOf(routeTag), 1);
    this.mapEngine.removeSource(routeTag);
  }
}
