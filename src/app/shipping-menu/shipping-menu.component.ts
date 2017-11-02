import { Component, OnInit, NgZone } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs';

@Component({
  selector: 'app-shipping-menu',
  templateUrl: './shipping-menu.component.html',
  styleUrls: ['./shipping-menu.component.less']
})
export class ShippingMenuComponent implements OnInit {

  private shippingInfoUrl = "http://selasfora-api-stg.us-east-2.elasticbeanstalk.com/api/shipping_zones";
  menuStatus = true;
  shippingRates:any  = {}
  open: boolean = false;
  countryList = [
    {title:'india'},
    {title:'rest of the world'}
  ]

  constructor( private zone:NgZone, private http : HttpClient) {


    // fetch shipping rates 
    http.get(this.shippingInfoUrl).map(data=>data).subscribe(data=>{
     this.countryList = data[0].countries.map(c=>{return {'title':c.name}})

     // get shipping rates:

     //standard shipping rate :

    this.shippingRates.standard = data[0]
                                    .price_based_shipping_rates
                                    .filter(s=>s.name.toLowerCase().indexOf("standard")>-1)
                                    .map(r=>{
                                      return {
                                        title : r.name? r.name.split("--")[0].toLowerCase() : "",
                                        desc: r.name ? r.name.split("--")[0].toLowerCase() : "",
                                        rate : r.price
                                      }
                                    })

    // Express
    this.shippingRates.standard = data[0]
                                    .price_based_shipping_rates
                                    .filter(s=>s.name.toLowerCase().indexOf("express")>-1)
                                    .map(r=>{
                                      return {
                                        title : r.name? r.name.split("--")[0].toLowerCase() : "",
                                        desc: r.name ? r.name.split("--")[0].toLowerCase() : "",
                                        rate : r.price
                                      }
                                    })  
    // Free
    this.shippingRates.standard = data[0]
                                    .price_based_shipping_rates
                                    .filter(s=>s.name.toLowerCase().indexOf("free")>-1)
                                    .map(r=>{
                                      return {
                                        title : r.name? r.name.split("--")[0].toLowerCase() : "",
                                        desc: r.name ? r.name.split("--")[0].toLowerCase() : "",
                                        rate : r.price
                                      }
                                    })    
    })

  }

  ngOnInit() {

   
  }


  openMenu() {
    this.menuStatus = false;
  }

  close() {
    this.open = false;
  }

  ngOnDesroy() {

  }

 

 

  

 

}
