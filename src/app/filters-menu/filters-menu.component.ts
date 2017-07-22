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

  constructor( public filtersService: FiltersService) { }

  ngOnInit() {
    let that = this;
    this.filtersService.filters.subscribe(
      (data) => {
        that.filters = data;
        if(that.filters.color) {
          that.filters.color.folded = true;
        }
      }
    );
  }

  accrodion(type) {
    this.filters[type].folded = !this.filters[type].folded;
  }

  openMenu() {
    this.menuStatus = false;
  }

  closeMenu() {
    this.menuStatus = true;
  }

}
