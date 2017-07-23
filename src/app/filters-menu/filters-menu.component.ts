import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-filters-menu',
  templateUrl: './filters-menu.component.html',
  styleUrls: ['./filters-menu.component.less']
})
export class FiltersMenuComponent implements OnInit {

  filters: any = {};
  menuStatus = true;
  open: boolean = false;
  subscriptions: Array<any> = [];
  selectedFilters: any = {};

  constructor(public filtersService: FiltersService) {}

  ngOnInit() {
    let that = this;
    this.subscriptions.push(this.filtersService.filters.subscribe(
      (data) => {
        that.filters = data;
        if(that.filters.color) {
          that.filters.color.folded = true;
        }
      }
    ));
    this.subscriptions.push(this.filtersService.open.subscribe(
      (data) => {
        that.open = data;
      }
    ));
  }

  accrodion(type) {
    this.filters[type].folded = !this.filters[type].folded;
  }

  openMenu() {
    this.menuStatus = false;
  }

  close() {
    //this.menuStatus = true;
    //this.out = true;
    this.filtersService.open.next(false);
  }

  ngOnDesroy() {
    this.subscriptions.forEach(function(item) {
      item.unsubscribe();
    });
  }

  filterClick(type, filter) {
    if(!this.selectedFilters[type]) this.selectedFilters[type] = [];

    if(type == 'color') {
      filter.active = !filter.active;
    }

    if(type == 'price') {
      if(this.selectedFilters[type].indexOf(filter.range) < 0) {
        let range = filter.range.split(' - ');
        this.selectedFilters['min_price'] = this.selectedFilters['min_price'] || Infinity;
        this.selectedFilters['max_price'] = this.selectedFilters['max_price'] || 0;
        if(this.selectedFilters['min_price'] > parseFloat(range[0])) {
          this.selectedFilters['min_price'] = parseFloat(range[0]);
        }
        if(this.selectedFilters['max_price'] < parseFloat(range[1])) {
          this.selectedFilters['max_price'] = parseFloat(range[1]);
        }
      } else {
        this.selectedFilters[type].splice(this.selectedFilters[type].indexOf(filter.range), 1);
      }
    } else {
      if(this.selectedFilters[type].indexOf(filter.name) < 0) {
        this.selectedFilters[type].push(filter.name);
      } else {
        this.selectedFilters[type].splice(this.selectedFilters[type].indexOf(filter.name), 1);
      }
    }
  }

  flatten() {
    let str = '?';
    for(let key in this.selectedFilters) {
      str += key + '=';
      if(key.indexOf('price') < 0) {
        str += this.selectedFilters[key].join(',');
      } else {
        str += this.selectedFilters[key];
      }
      str += '&';
    }
    console.log('query string:', str);
    return str;
  }

  search() {
    let query = this.flatten();
    console.log(this.selectedFilters, this.flatten());
  }

}
