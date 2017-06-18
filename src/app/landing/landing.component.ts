import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {

  @Input() page = {
    colorShade: 'dark',
    imagePath: ''
  };

  constructor() {
  }

  ngOnInit() {
  }

}
