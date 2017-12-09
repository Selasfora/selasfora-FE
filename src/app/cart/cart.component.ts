import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.less']
})
export class CartComponent implements OnInit {
  orderItems:any[] = [1,2,3,4]
  constructor() { }

  ngOnInit() {
  }

}
