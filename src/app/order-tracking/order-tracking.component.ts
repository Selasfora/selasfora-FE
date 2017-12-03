import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {AuthService} from "../auth.service";
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
  order:any = null;
  hideheader:any;
  orderType="confirmed" // confirmed | cancled | returned 
  constructor(private userService:UserService, private service:AuthService) {

      // fetch the otder
      this.order = userService.getOrderHistoryItem();

      

      
   }

  ngOnInit() {
  }

  returnOrder(){

  }

}
