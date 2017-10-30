import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.less']
})
export class OrderTrackingComponent implements OnInit {
  pageTitle:string = "Returned order";
  orderStatus:string = "Arrived";
  arrivalDate:string = "24th oct , 2017";
  statusDescription:string = "arrived on blah blah";
  itemCount:number = 5;
  orderTotal:number = 5000;
  orderNumber:number = 1255456;
  orderItems:any[] = [1,2,3,4]
  constructor() { }

  ngOnInit() {
  }

}
