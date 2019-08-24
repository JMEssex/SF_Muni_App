import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

import { routeList } from '../../data/route-list';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{
  @ViewChild('searchBar', {static: true}) searchBar: IonSearchbar;
  routes = routeList;
  filteredBusList;
  routePills: string[] = [];
  constructor() {
  }



  ngAfterViewInit() {
    this.searchBarInit();
  }

  searchBarInit() {
    this.searchBar.ionChange.subscribe((val: any) => {
      if (val.detail.value !== '') {
        this.filteredBusList = this.routes.route.filter(route => route.tag.includes(val.detail.value));
      } else {
        this.filteredBusList = [];
      }
    });
  }

  addRoutePill(route) {
    if (this.routePills.length < 3 && this.routePills.indexOf(route.tag) === -1) {
      this.routePills.push(route.tag);
    }
  }

  removeRoutePill(pill: string) {
    this.routePills.splice(this.routePills.indexOf(pill), 1);
  }



}
