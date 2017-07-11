import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  menuStatus = true;
  @Input() type;
  @Input() page;

  constructor() { }

  ngOnInit() {
  }

  openMenu() {
    this.menuStatus = false;
  }

  closeMenu() {
    this.menuStatus = true;
  }
}
