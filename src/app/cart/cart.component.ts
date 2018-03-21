import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {UserService} from '../user.service';
import {AuthService} from '../auth.service';
import {DynamicTranslationService} from "../dynamic-translation.service";
declare var window:any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  orderItems:any[] = [1,2,3,4];
  checkoutUrl = '';
  hideheader = false;
  constructor(private cartService:CartService, private userService:UserService, private auth:AuthService, private dynamicTranslations: DynamicTranslationService) {


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
          this.orderItems.map((oi,index)=>{
            let prop = window.localStorage.getItem(oi.variant_id) ? JSON.parse( window.localStorage.getItem(oi.variant_id)) : null;

            if(prop){
              oi.p_title = prop.title;
              oi.p_image = prop.img
            }

            oi.v_title = oi.variant_title

            this.dynamicTranslations.getTranslation([oi.p_title,oi.variant_title],"html").then(res=>{
              this.orderItems[index].p_title = res[0][0]
              this.orderItems[index].v_title= res[0][1];
            })

            return oi

          })


          // translate props 


        }
     

      checkout(){
        window.location.href = this.checkoutUrl;
      }

      removeItem(item){
        this.cartService.removeItem(item.id)
          this.orderItems = (this.cartService.getCart().getValue() as any).items;
          this.checkoutUrl = (this.cartService.getCheckoutUrl().getValue() as any).items;

      }

      changeQty(item,count){
        this.cartService.updateItemcount(item.id,item.quantity+count)
        this.orderItems = (this.cartService.getCart().getValue() as any).items;
        this.checkoutUrl = (this.cartService.getCheckoutUrl().getValue() as any).items;
      }

}


