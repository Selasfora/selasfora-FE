import { Component, OnInit, Inject } from '@angular/core';
import { PageScrollInstance, PageScrollService, EasingLogic } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';
import { WindowService } from '../window.service'

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.less']
})

export class LandingpageComponent implements OnInit {
  public pages = [
    {
      imagePath: '/assets/images/02@2x.png',
      mobileImagePath: '/assets/images/02@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'Selasfora bracelet',
        subtext: 'The Limited-edition Paint-splattered Collection is created by set designer Tracy.',
        cta: 'Watch the film',
        btn: 'Create your own'
      },
      position: 'bottom'
    },
    {
      imagePath: '/assets/images/03@2x.png',
      mobileImagePath: '/assets/images/03@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'Easy to customize',
        subtext: 'We wanted to capture the color of a summer night\'s sky',
        cta: 'Patent pending technology'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/04@2x.png',
      mobileImagePath: '/assets/images/04@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'Easy to wear',
        subtext: 'We believe that great style begins with great design. Every single piece is conceived in our studio, where designers sketch, drape, tuck and bead a collection to life'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/05@2x.png',
      mobileImagePath: '/assets/images/05@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'Perfect for any occasion',
        subtext: 'Sophisticated and perfectly chunky, this is the kind of piece that adds a touch of effortless polish to just about any outfit.',
        btn: 'Get your bracelet'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/06@2x.png',
      mobileImagePath: '/assets/images/06@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'The magic is in the mix',
        subtext: 'We side with style over fashion, think timelessness is underrated and find that style look best when they’re lived in.',
        cta: 'Shop charms'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/07@2x.png',
      mobileImagePath: '/assets/images/07@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'Stay in touch',
        subtext: 'Be the first to know about our new collection and other news',
        cta: 'Patent pending technology'
      },
      position: 'top'
    }
  ];

  window: any;

  constructor(@Inject(DOCUMENT) private document: any,
    private pageScrollService: PageScrollService, _window: WindowService) {
    this.window = _window.nativeWindow;
  }

  ngOnInit() {
  }


  /*public myEasing: EasingLogic = {
    ease: (t: number, b: number, c: number, d: number): number => {
      console.log('easing')
      if (t === 0) return b;
      if (t === d) return b + c;
      if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  };*/

  scrollPage() {
    this.scrollBy(this.window.innerHeight, 500);
  }

  scrollBy(distance, duration) {

    var initialY = document.body.scrollTop;
    var y = initialY + distance;
    var baseY = (initialY + y) * 0.5;
    var difference = initialY - baseY;
    var startTime = performance.now();
    var that = this;

    function step() {
        var normalizedTime = (performance.now() - startTime) / duration;
        if (normalizedTime > 1) normalizedTime = 1;

        that.window.scrollTo(0, baseY + difference * Math.cos(normalizedTime * Math.PI));
        if (normalizedTime < 1) that.window.requestAnimationFrame(step);
    }
    this.window.requestAnimationFrame(step);
  }
}
