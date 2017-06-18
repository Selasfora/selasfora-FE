import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  menuHidden = true;

  @Input() menuStatus;
  @Output() closeMenu = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  close() {
    this.menuHidden = true;
    this.closeMenu.emit(true);
  }
}
