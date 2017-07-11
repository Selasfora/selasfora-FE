import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less']
})
export class ProductComponent implements OnInit {

  @Input() item;
  @HostBinding('class.bracelet') bracelet: boolean = false;
  @HostBinding('class.charm') charm: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if(this.item.product_type == 'charm') this.charm = true;
    if(this.item.product_type == 'bracelet') this.bracelet = true;
  }

}
