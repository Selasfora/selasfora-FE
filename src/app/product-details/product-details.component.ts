import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.less']
})
export class ProductDetailsComponent implements OnInit {
  mode: string = 'grid';
  id: any;
  type: string = '';
  product: object = {};

  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router) { }

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
            that.product = data;
            console.log('product', data);
          }
        );
      }
    );
  }

}
