import { Component, OnInit, Input, Inject } from '@angular/core';
import { WindowService } from '../window.service';
import { PageScrollInstance, PageScrollService, EasingLogic } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})

export class LandingComponent implements OnInit {

  @Input() page: any = {
    colorShade: 'dark',
    imagePath: ''
  };

  @Input() idx: any;

  private window: any;

  public myEasing: EasingLogic = {
    ease: (t: number, b: number, c: number, d: number): number => {
      if (t === 0) return b;
      if (t === d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  };


  constructor(private $window: WindowService, @Inject(DOCUMENT) private document: any,
    private pageScrollService: PageScrollService) {
    this.window = $window.nativeWindow;
  }

  ngOnInit() {
  }

}
