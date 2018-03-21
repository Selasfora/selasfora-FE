import { Injectable } from '@angular/core';
import { WindowService } from './window.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import { Config } from './Config';
declare var window:any;


@Injectable()
export class CartService {
  public cart = null;
  private window;
  private checkoutURL: BehaviorSubject<string> = new BehaviorSubject('');
  private basketCount: BehaviorSubject<object> = new BehaviorSubject({});
  private basketItems: BehaviorSubject<object> = new BehaviorSubject({});

  constructor(private _window: WindowService) {
    this.window = _window.nativeWindow;
    this.window.shopClient = this.window.ShopifyBuy.buildClient({
      accessToken: Config.accessToken,
      domain: Config.domain,
      appId: Config.appId
    });
    this.createCart();
  }

  getCart() {
    return this.basketItems;
  }

  createCart() {
    if (this.cart) {
      return this.cart;
    }

    this.cart = true; // to prevent multiple creations
    const that = this;

    const interval = this.window.setInterval(function() {
      if (that.window.shopClient) {
        that.window.clearInterval(interval);

        that.window.shopClient.fetchRecentCart()
        .then(function (cart) {
          console.log('we got the cart', cart.lineItemCount, cart.lineItems)
          that.cart = cart;
          that.checkoutURL.next(cart.checkoutUrl);
          that.basketCount.next({ count: that.cart.lineItemCount, price: that.cart.subtotal });
          that.basketItems.next({ items: that.cart.lineItems });
          return that.cart;
        });
      }
    }, 1000);
  }

  addToCart(item,product): any {
    if (!item.variant) {
      return Observable.throw({'status': 'error', 'message': 'no variant selected!'}).toPromise();
    }

    if (!item.quantity) { item.quantity = 1; }
    const that = this;

      // store some product meta into local storage

      let img = null;

      if(product.image) img = product.image.src;
      else if(product.src) img = product.src;
      else if(product.img.length)  img = product.img[0].src

      window.localStorage.setItem(item.variant.id,JSON.stringify({
            title:product.title,
            img : img
            }))
    return  that.cart.createLineItemsFromVariants(item)

  
    
  }

  updateUrl(url) {
    this.checkoutURL.next(url);
  }

  getCheckoutUrl() {
    return this.checkoutURL;
  }

  getCartCount() {
    return this.basketCount;
  }

  updateCount(data) {
    this.basketCount.next(data);
  }

  updateBasketItems(data) {
    this.basketItems.next(data);
  }

  updateItemcount(item,count){
    const that = this;
   return that.cart.updateLineItem(item,count).then(data=>{
    that.cart = data;
    that.checkoutURL.next(data.checkoutUrl);
    that.basketCount.next({ count: that.cart.lineItemCount, price: that.cart.subtotal });
    that.basketItems.next({ items: that.cart.lineItems });
    return that.cart;
   })
  }

  removeItem(item){
    const that = this;
    window.localStorage.removeItem(item.variant_id)
  that.cart.removeLineItem(item).then(data=>{
    that.cart = data;
    that.checkoutURL.next(data.checkoutUrl);
    that.basketCount.next({ count: that.cart.lineItemCount, price: that.cart.subtotal });
    that.basketItems.next({ items: that.cart.lineItems });
    return that.cart;
  })

}

}