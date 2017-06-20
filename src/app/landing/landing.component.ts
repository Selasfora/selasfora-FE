import { Component, Input, Inject } from '@angular/core';
import { WindowService } from '../window.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})

export class LandingComponent {

  @Input() page: any = {
    colorShade: 'dark',
    imagePath: ''
  };

  @Input() idx: any;

  private window: any;
  public position: any = {};

  constructor(private $window: WindowService) {
    this.window = $window.nativeWindow;
  }

  ngOnChanges() {
    this.position[this.page.position] = '60px';
  }


}
