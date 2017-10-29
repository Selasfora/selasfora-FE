import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.less']
})
export class OrderTrackingComponent implements OnInit {
  pageTitle:string = "Returned order";
  constructor() { }

  ngOnInit() {
  }

}
