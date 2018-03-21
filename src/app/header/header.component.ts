import { Component, OnInit, Input } from '@angular/core';
import { FiltersService } from '../filters.service';
import { CartService } from '../cart.service';
import { Router, ActivatedRoute, ParamMap , NavigationEnd, Event, } from '@angular/router';
declare var window:any;
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

  constructor(public filtersService: FiltersService, public cart: CartService, private router: Router) {
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
  
    router.events.subscribe((events:any)=>{
      
      window.NavigationCompletedEvent = NavigationEnd;
      if(!(events instanceof window.NavigationCompletedEvent)) return ;
      
     
      this.type = this.type || ( this.router.url.indexOf("/catalog/charm") >=0 ? 'charm':'' ) || (this.router.url.indexOf("/catalog/bracelet") >= 0 ? 'bracelet':'' )
          // if mixMatch // set eveyrthing fixed:
          if(this.router.url.indexOf("/mixmatch") >=0){
            this.type =  this.router.url.indexOf("/mixmatch?step=1") >=0 ? 'bracelet': '' || this.router.url.indexOf("/mixmatch?step=2") >=0 ? 'charm': '' || this.router.url.indexOf("/mixmatch?step=3") >=0 ? 'mix': '';
          }

    

    })

    this.type = this.type || ( this.router.url.indexOf("/catalog/charm") >=0 ? 'charm':'' ) || (this.router.url.indexOf("/catalog/bracelet") >= 0 ? 'bracelet':'' )
    // if mixMatch // set eveyrthing fixed:
    if(this.router.url.indexOf("/mixmatch") >=0){
      this.type =  this.router.url.indexOf("/mixmatch?step=1") >=0 ? 'bracelet': 'mix' || this.router.url.indexOf("/mixmatch?step=2") >=0 ? 'charm': 'mix' || this.router.url.indexOf("/mixmatch?step=2") >=0 ? 'mix': '';
    }

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
