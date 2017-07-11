import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  menuStatus = true;
  @Input() type;

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
