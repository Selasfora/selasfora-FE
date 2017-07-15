import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  @Input() item;
  @Input() mode;

  @HostBinding('class.col-xs-12') bracelet_mobile: boolean = false;
  @HostBinding('class.col-md-6') bracelet: boolean = false;
  @HostBinding('class.col-xs-6') charm_mobile: boolean = false;
  @HostBinding('class.col-md-4') charm: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if(this.item.product_type == 'charm') {
      this.charm = true;
      this.charm_mobile = true;
    } else if(this.item.product_type == 'bracelet') {
      this.bracelet = true;
      this.bracelet_mobile = true;
    }
  }
}
