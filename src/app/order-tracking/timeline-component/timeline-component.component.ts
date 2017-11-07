import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline-component',
  templateUrl: './timeline-component.component.html',
  styleUrls: ['./timeline-component.component.less']
})
export class TimelineComponentComponent implements OnInit {
  completes:any;
  toggleButton:any;
  trackingLabels = ["STATUS_ORDER_PLACED","STATUS_ORDER_SHIPPED","STATUS_ORDER_CONFIRMED"];

  constructor() { 
    this.completes = document.querySelectorAll(".complete");
    this.toggleButton = document.getElementById("toggleButton");
   // this.toggleButton.onclick =this.toggleComplete;
  }

   
  toggleComplete(){
    var lastComplete = this.completes[this.completes.length - 1];
    lastComplete.classList.toggle('complete');
  }

  ngOnInit() {
  }

  

}
