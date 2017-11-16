import { Component, OnInit,ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { CartService } from '../cart.service';
import { Config } from '../config';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ToastrService } from 'toastr-ng2';
import {ShippingMenuComponent} from '../shipping-menu/shipping-menu.component'
import {TranslateService} from "@ngx-translate/core";
import {DynamicTranslationService} from "../dynamic-translation.service"

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('shippingMenu') shippingMenu: ShippingMenuComponent;
  mode = 'grid';
  id: any;
  type = '';
  product: any = {variants: [{price: ''}]};
  window: any = null;
  shopClient: any;
  mainImage = '';
  open = false;


  public pages = [
    {
      imagePath: '/assets/images/03@2x.png',
      mobileImagePath: '/assets/images/03@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'Easy to customize',
        subtext: 'We wanted to capture the color of a summer night\'s sky',
        cta: 'Patent pending technology'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/04@2x.png',
      mobileImagePath: '/assets/images/04@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'Easy to wear',
        subtext: 'We believe that great style begins with great design. Every single piece is conceived in our studio, where designers sketch, drape, tuck and bead a collection to life'
      },
      position: 'top'
    }
  ];

  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router, private translate: TranslateService,
      private windowService: WindowService, public _cart: CartService, private toastrService: ToastrService, private dynamicTranslations: DynamicTranslationService) {
    this.window = windowService.nativeWindow;
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe((data) => {
        this.type = data.get('type');
        this.id = data.get('id');

        if(this.type.toLowerCase() !== 'charm' && this.type.toLowerCase() !== 'bracelet') {
          this.router.navigate(['/404']);
          return;
        }

        let that = this;
        that.service.fetchProduct(this.id)
        .subscribe(
          (data) => {
            console.log('product', data)

            // convert the html to text before translating
            let parser = new DOMParser();
            data.body_html= parser.parseFromString( data.body_html , 'text/html').querySelector('body').innerText;

            // translate the product details
            this.dynamicTranslations.getTranslation([data.title,data.body_html]).subscribe(res=>{
              data.title = res[0][0]
              data.body_html = res[0][1];
              that.product = data;
            })
            
          }
        );
      }
    );
  }

  ngAfterViewInit() {
    this._cart.createCart();
  }

  openMenu() {
    this.open = true;
  }

  openShippingMenu(){
    this.shippingMenu.open = true;
  }

  closeMenu(event) {
    if(!event) {
      this.open = false;
    }
  }

  addToCart(item) {

    

    this._cart.addToCart({variant: this.product.variants[0], quantity: 1})
    .then(
      (data:any) => {
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

  switchImage(img) {
    this.mainImage = img;
  }

 /*storeItem(item){
     // add stuff to local storage 
    let selected_items:any[]  = JSON.parse(localStorage.getItem('selected_items')||'[]');


    let item_to_add = {
      title:item.title,
      img:item.image.src,
      type:item.product_type,
      id:item.id,
    }

     selected_items.push(item_to_add);

     localStorage.setItem('selected_items',JSON.stringify(selected_items));
  }*/

}
