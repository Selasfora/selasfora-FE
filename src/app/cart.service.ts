import { Injectable } from '@angular/core';
import { WindowService } from './window.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import { Config } from './Config';


@Injectable()
export class CartService {
  private cart = null;
  private window;
  private checkoutURL:BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private _window:WindowService) {
    this.window = _window.nativeWindow;
    this.window.shopClient = this.window.ShopifyBuy.buildClient({
      accessToken: Config.accessToken,
      domain: Config.domain,
      appId: Config.appId
    });
    this.createCart();
  }

  createCart() {
    if(this.cart) return this.cart;
    this.cart = true; // to prevent multiple creations
    let that = this;

    let interval = this.window.setInterval(function() {
      console.log('trying')
      if(that.window.shopClient) {
        that.window.clearInterval(interval);

        that.window.shopClient.createCart()
        .then(function (cart) {
          that.cart = cart;
          that.checkoutURL.next(cart.checkoutUrl);
          console.log('cart created', cart);
          return that.cart;
        });
      }
    }, 1000);
  }

  addToCart(item) {
    if(!item.variant) {
      return Observable.throw({'status': 'error', 'message': 'no variant selected!'});
    }

    if(!item.quantity) { item.quantity = 1; }
    let that = this;
    return Observable.fromPromise(
      that.cart.createLineItemsFromVariants(item).then(function(res) {
        console.log('res', res)
      })
    );
  }

  getCheckoutUrl() {
    return this.checkoutURL;
  }
}
