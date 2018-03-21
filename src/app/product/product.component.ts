import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { CartService } from '../cart.service';
import { ToastrService } from 'toastr-ng2';
import {TranslateService} from "@ngx-translate/core";
declare var clevertap:any;
declare var $:any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  public _mode;

  @Input() item;
   @Input('canAddToCart') canAddToCart:any = true;
   @Input('isMixMatch') isMixMatch:boolean;
  @Input() set mode(value) {
    console.log('changing to ', value)
    this._mode = value;
   
  }



  constructor(public _cart: CartService, private toastrService: ToastrService, private translate:TranslateService) {
  }

  ngOnInit() {

  }



  addToCart(item) {
    

     // add the same to the cart;
  
    
    if( this.canAddToCart == "false") {
      this.storeItem(item);
      return;
    };

    this._cart.addToCart({variant: this.item.variants[0], quantity: 1},this.item)
    .then(
      (data: any) => {      
        this._cart.updateUrl(data.checkoutUrl);
        this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
        this._cart.updateBasketItems({items:data.lineItems});
        data.updateModel();
        this.translate.get("SUCCESS_CART_ADD").subscribe((res:string)=>{
          
                      this.toastrService.success(
                        res,
                        'Success!'
                      );
                    });

                    // notify clever tap:
                    clevertap.event.push("product added to cart",{
                      "product type":this.item.product_type,
                      "product name":this.item.title
                    })
      },
      (error) => {
        this.translate.get("ERROR_CART_ADD").subscribe((res:string)=>{
          
                      this.toastrService.error(
                        res,
                        'Error!'
                      );
                    })

                    // notify clever tap:
                    clevertap.event.push("product add to cart not successful",{
                      "product type":this.item.product_type,
                      "product name":this.item.title
                    })
      }
    );
  }

  selectContinue(item) {
    this.addToCart(item);
  }

  count(item){
    let selected_items:any[]  = JSON.parse(localStorage.getItem('selected_items')||'[]');
    let slectedCount = selected_items.filter(i=> i.id == item.id).length;
    return slectedCount;
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

     if(selected_items.filter(i=> i.id == item_to_add.id).length == 0)
      selected_items.push(item_to_add);
     else 
      return;

     localStorage.setItem('selected_items',JSON.stringify(selected_items));
     if (selected_items.length == 2)
     {

      if(window.innerWidth > 768){
        $("#mixmatchlink").popover("show");
        setTimeout(()=> {
          $("#mixmatchlink").popover("hide");
        }, 3000)

      }
      else
      {
        this.translate.get("SUCCESS_ITEM_SELECTED").subscribe((res:string)=>{
        
                    this.toastrService.success(
                      res,
                      'Success!'
                    );
                  })
        }
      }
  }
}
