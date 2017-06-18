import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.less']
})
export class IconComponent implements OnInit {
  @Input() title: string = 'menu';
  @Input() image: string = '';

  constructor() { }

  ngOnInit() {
  }

}
