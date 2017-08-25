import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit {
  showMenu = '';
  
  @Input() selectedItem = 'Select';
  @Input() isForm = false;
  @Input() itemList = [
    {
      title: 'Small',
      subtitle: 'Wrist size: < 15 cm'
    },
    {
      title: 'Medium',
      subtitle: 'Wrist size: 15-16 cm'
    },
    {
      title: 'Large',
      subtitle: 'Wrist size 15-16.5 cm'
    }
  ];

  @Output() itemChange =  new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.showMenu = this.showMenu == 'show' ? '' : 'show';
  }

  selectItem(item) {
    this.showMenu = '';
    this.selectedItem = item;
    this.itemChange.emit(item);
  }
}
