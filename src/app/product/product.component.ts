import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { CartService } from '../cart.service';
import { ToastrService } from 'toastr-ng2';
import {TranslateService} from "@ngx-translate/core"

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  public _mode;

  @Input() item;
   @Input('canAddToCart') canAddToCart:any = true;
  @Input() set mode(value) {
    console.log('changing to ', value)
    this._mode = value;
    this.evaluateCells();
  }

  @HostBinding('class.col-xs-12') bracelet_mobile = false;
  @HostBinding('class.col-md-6') bracelet = false;
  @HostBinding('class.col-xs-6') charm_mobile = false;
  @HostBinding('class.col-md-4') charm = false;

  constructor(public _cart: CartService, private toastrService: ToastrService, private translate:TranslateService) {
  }

  ngOnInit() {
    this.evaluateCells();
  }

  evaluateCells() {
    if (this._mode !== 'grid') {
      this.charm = false;
      this.charm_mobile = false;
      this.bracelet = false;
      this.bracelet_mobile = false;
      return;
    }

    if (this.item.product_type === 'charm') {
      this.charm = true;
      this.charm_mobile = true;
    } else if (this.item.product_type === 'bracelet') {
      this.bracelet = true;
      this.bracelet_mobile = true;
    }
  }

  addToCart(item) {
    

     // add the same to the cart;
  
    
    if( this.canAddToCart == "false") {
      this.storeItem(item);
      return;
    };

    this._cart.addToCart({variant: this.item.variants[0], quantity: 1})
    .then(
      (data: any) => {      
        this._cart.updateUrl(data.checkoutUrl);
        this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
        this.translate.get("SUCCESS_CART_ADD").subscribe((res:string)=>{
          
                      this.toastrService.success(
                        res,
                        'Success!'
                      );
                    })
      },
      (error) => {
        this.translate.get("ERROR_CART_ADD").subscribe((res:string)=>{
          
                      this.toastrService.success(
                        res,
                        'Error!'
                      );
                    })
      }
    );
  }

  selectContinue(item) {
    this.addToCart(item);
  }

  storeItem(item){
     // add stuff to local storage 
    let selected_items:any[]  = JSON.parse(localStorage.getItem('selected_items')||'[]');

    

    let item_to_add = {
      title:item.title,
      img:item.images,
      type:item.product_type,
      id:item.id,
      cartItem:item
    }

     selected_items.push(item_to_add);

     localStorage.setItem('selected_items',JSON.stringify(selected_items));
     this.translate.get("SUCCESS_ITEM_SELECTED").subscribe((res:string)=>{
      
                  this.toastrService.success(
                    res,
                    'Success!'
                  );
                })
  }
}
