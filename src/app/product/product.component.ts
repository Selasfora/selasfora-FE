import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { CartService } from '../cart.service';
import { ToastrService } from 'toastr-ng2';

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

  constructor(public _cart: CartService, private toastrService: ToastrService) {
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

    this.storeItem(item);
    if( this.canAddToCart == "false") return;

    this._cart.addToCart({variant: this.item.variants[0], quantity: 1})
    .subscribe(
      (data: any) => {      
        this._cart.updateUrl(data.checkoutUrl);
        this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
        this.toastrService.success('Your product was added successfully!', 'Success!');
      },
      (error) => {
        this.toastrService.error('Your product was not added!', 'Something went wrong!');
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
      img:item.image.src,
      type:item.product_type,
      id:item.id,
      cartItem:item
    }

     selected_items.push(item_to_add);

     localStorage.setItem('selected_items',JSON.stringify(selected_items));
  }
}
