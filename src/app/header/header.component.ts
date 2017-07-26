import { Component, OnInit, Input } from '@angular/core';
import { FiltersService } from '../filters.service';
import { CartService } from '../cart.service';

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
  public url = '';

  constructor(public filtersService: FiltersService, public cart: CartService) {
    cart.getCheckoutUrl().subscribe(
      (data) => {
        this.url = data;
      }
    );
  }

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
