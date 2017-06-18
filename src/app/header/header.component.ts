import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  menuStatus = true;

  constructor() { }

  ngOnInit() {
  }

  openMenu() {
    this.menuStatus = false;
    console.log('opening menu in header');
  }

  closeMenu() {
    this.menuStatus = true;
    console.log('closing menu in header');
  }
}
