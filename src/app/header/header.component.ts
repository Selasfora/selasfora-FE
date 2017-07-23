import { Component, OnInit, Input } from '@angular/core';
import { FiltersService } from '../filters.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  host: {'class': 'col-sm-12'}
})
export class HeaderComponent implements OnInit {

  menuStatus = true;
  @Input() type;
  @Input() page;
  @Input() filter = false;

  constructor(public filtersService: FiltersService) { }

  ngOnInit() {
  }

  openMenu() {
    this.menuStatus = false;
  }

  closeMenu() {
    this.menuStatus = true;
  }

  openFiltersMenu() {
    this.filtersService.open.next(true);
  }
}
