import { Component, OnInit, NgZone } from '@angular/core';
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

  constructor(public filtersService: FiltersService, private zone:NgZone) {}

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
    if(type == 'price' && this.selectedFilters[type].indexOf(filter.range) < 0) {
      this.selectedFilters[type].push(filter.range);
    } else if(type !== 'price' && this.selectedFilters[type].indexOf(filter.name) < 0) {
      this.selectedFilters[type].push(filter.name);
    } else if(type !== 'price' && this.selectedFilters[type].indexOf(filter.name) >= 0) {
      this.selectedFilters[type].splice(this.selectedFilters[type].indexOf(filter.name), 1);
    } else if(type == 'price' && this.selectedFilters[type].indexOf(filter.range) >= 0) {
      this.selectedFilters[type].splice(this.selectedFilters[type].indexOf(filter.range), 1);
    }
  }

  flatten() {
    let str = '?';
    for(let key in this.selectedFilters) {
      if(key.indexOf('price') < 0) {
        if(!this.selectedFilters[key] || !this.selectedFilters[key].length) continue;
        str += key + '=';
        str += this.selectedFilters[key].join(',');
      } else {
        let min_price = Infinity;
        let max_price = 0;
        this.selectedFilters[key].forEach(function(item) {
          let range = item.split(' - ');
          if(min_price > parseFloat(range[0])) {
            min_price = parseFloat(range[0]);
          }
          if(max_price < parseFloat(range[1])) {
            max_price = parseFloat(range[1]);
          }
        });
        if(min_price && min_price != Infinity) {
          str += 'min_price=' + min_price;
        } if(max_price) {
          str += '&max_price=' + max_price;
        }
      }
      str += '&';
      str.replace('&&', '&').replace('?&', '');
    }
    return str;
  }

  search() {
    this.close();
    let query = this.flatten();
    console.log(this.selectedFilters, query);
    this.filtersService.query.next(query);
  }

  clear() {
    this.selectedFilters = {};
    this.search();
  }

}
