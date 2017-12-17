import { Component, OnInit } from '@angular/core';
declare var google:any;

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.less']
})
export class UserLocationComponent implements OnInit {
  currentCountry = "usa";
  flag="flag-icon flag-icon-us";
  constructor() { }

  ngOnInit() {
    this.getLocation();
  }

  getLocation() {
    debugger;
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((location)=>{

       let  geocoder = new google.maps.Geocoder;
       geocoder.geocode({'location': {lat:location.coords.latitude, lng: location.coords.longitude}}, (results, status)=> {
         if (status === 'OK') {
           if (results[0]) {
    
               let add = results[0].formatted_address.split(',');
               this.currentCountry= add[add.length-1];
               this.flag= "flag-icon flag-icon-"+this.currentCountry.trim().split("").slice(0,2).join("").toLowerCase();
             
           } else {
             window.alert('No results found');
           }
         } else {
           window.alert('Geocoder failed due to: ' + status);
         }
       },(err=>{console.log(err)})
       ,{
         enableHighAccuracy: true
              ,timeout : 5000
    });

       });
   } else {
       console.log("geolocation not supported")
   }
}


}
