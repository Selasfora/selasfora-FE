import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit {
  showMenu = '';
  selectedItem = 'Select';
  
  itemList = [
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
    },
    {
      title: 'Size Guide'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  toggleMenu() {
    this.showMenu = this.showMenu == 'show' ? '' : 'show';
  }

  selectItem(item) {
    this.showMenu = '';
    this.selectedItem = item;
  }
}
