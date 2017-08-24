import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { CartService } from '../cart.service';
import { Config } from '../config';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
  mode: string = 'grid';
  id: any;
  type: string = '';
  product: any = {variants: [{price: ''}]};
  window: any = null;
  shopClient: any;
  mainImage = '';

  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router,
      private windowService: WindowService, public _cart: CartService, private toastrService: ToastrService) {
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
            that.product = data;
          }
        );
      }
    );
  }

  ngAfterViewInit() {
    this._cart.createCart();
  }

  addToCart() {
    this._cart.addToCart({variant: this.product.variants[0], quantity: 1})
    .subscribe(
      (data:any) => {
        this._cart.updateUrl(data.checkoutUrl);
        this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
        this.toastrService.success('Your product was added successfully!', 'Success!');
      },
      (error) => {
        this.toastrService.error('Your product was not added!', 'Something went wrong!');
      }
    );

  }

  switchImage(img) {
    this.mainImage = img;
  }
}
