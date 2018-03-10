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
  @Input() type:any;
  @Input() page:any;
  @Input() filter:any = false;
  @Input() showBack:any = false;
  cartCount:any;
  @Input('showFilterIcon') showFilterIcon:any = false;
  public url = '';

  constructor(public filtersService: FiltersService, public cart: CartService) {
    cart.getCheckoutUrl().subscribe(
      (data) => {
        this.url = data;
      }
    );

    cart.getCartCount().subscribe(
      (data) => {
        this.cartCount = data;
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

  goBack(){
    window.history.back()
  }
}
