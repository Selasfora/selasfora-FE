import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';
declare var window:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  orderItems:any[] = [1,2,3,4];
  checkoutUrl = '';
  
  constructor(private cartService:CartService, private userService:UserService, private auth:AuthService) {


    this.cartService.getCart().subscribe(
      (cart:any) => {

        /**
         * get images related to the orders 
         */
        
        this.orderItems = cart.items || [];
        this.addProductProps()
        
        
  
        })


        this.cartService.getCheckoutUrl() .subscribe((url)=>{
          this.checkoutUrl = url;
        })

       

   }
  ngOnInit(){}
  ngAfterViewInit() {
    this.orderItems = (this.cartService.getCart().getValue() as any).items || [];
    this.checkoutUrl = (this.cartService.getCheckoutUrl().getValue() as any);
    this.addProductProps();
      }

        addProductProps(){
          this.orderItems.map(oi=>{
            let prop = window.localStorage.getItem(oi.variant_id) ? JSON.parse( window.localStorage.getItem(oi.variant_id)) : null;

            if(prop){
              oi.p_title = prop.title;
              oi.p_image = prop.img
            }

            return oi

          })
        }
     

      checkout(){
        window.location.href = this.checkoutUrl;
      }

      removeItem(item){
        this.cartService.removeItem(item.id)
          this.orderItems = (this.cartService.getCart().getValue() as any).items;
          this.checkoutUrl = (this.cartService.getCheckoutUrl().getValue() as any).items;

      }

}


