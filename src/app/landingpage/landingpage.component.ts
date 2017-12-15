import { Component, OnInit, Inject } from '@angular/core';
import { PageScrollInstance, PageScrollService, EasingLogic } from 'ng2-page-scroll';
import { DOCUMENT } from '@angular/platform-browser';
import { WindowService } from '../window.service'
import * as  scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.less']
})

export class LandingpageComponent implements OnInit {

  private scrollPages:any[] = []
  private pager:number=1;
  private maxPages:number = 0;
  public bgColors = [
 "#272caa",
 "#ffffff",
  "#191919",
  "#c6c6c8",
  "#fffffff",
  "#272caa"
  ]

  public pages = [
    {
      imagePath: '/assets/images/02@2x.png',
      mobileImagePath: '/assets/images/02@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'HOME_TITLE_1',//'Selasfora bracelet',
        subtext: 'HOME_SUBTEXT_1',//'The Limited-edition Paint-splattered Collection is created by set designer Tracy.',
        cta: 'HOME_CTA_1',//'Watch the film',
        btn: 'HOME_CTA_BUTTON_1',//'Create your own',
        class: 'secondary-btn',
        href: ''
      },
      position: 'bottom'
    },
    {
      imagePath: '/assets/images/03@2x.png',
      mobileImagePath: '/assets/images/03@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'HOME_TITLE_2',//'Easy to customize',
        subtext: 'HOME_SUBTEXT_2',// 'We wanted to capture the color of a summer night\'s sky',
        cta: 'HOME_CTA_2',//'Patent pending technology'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/04@2x.png',
      mobileImagePath: '/assets/images/04@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'HOME_TITLE_3',//'Easy to wear',
        subtext: 'HOME_SUBTEXT_3',//'We believe that great style begins with great design. Every single piece is conceived in our studio, where designers sketch, drape, tuck and bead a collection to life'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/05@2x.png',
      mobileImagePath: '/assets/images/05@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'HOME_TITLE_4',//'Perfect for any occasion',
        subtext: 'HOME_SUBTEXT_4',//'Sophisticated and perfectly chunky, this is the kind of piece that adds a touch of effortless polish to just about any outfit.',
        btn: 'HOME_CTA_BUTTON_4',//'Get your bracelet',
        class: 'secondary-btn',
        href: '/catalog/bracelet'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/06@2x.png',
      mobileImagePath: '/assets/images/06@2x-mobile.png',
      colorShade: 'light',
      content: {
        title: 'HOME_TITLE_5',//'The magic is in the mix',
        subtext: 'HOME_SUBTEXT_5',// 'We side with style over fashion, think timelessness is underrated and find that style look best when they’re lived in.',
        btn: 'HOME_CTA_BUTTON_5',//'Shop Charms',
        class: 'tetiary-btn',
        href: '/catalog/charm'
      },
      position: 'top'
    },
    {
      imagePath: '/assets/images/07@2x.png',
      mobileImagePath: '/assets/images/07@2x-mobile.png',
      colorShade: 'dark',
      content: {
        title: 'HOME_TITLE_6',//'Stay in touch',
        subtext: 'HOME_SUBTEXT_6',//'Be the first to know about our new collection and other news',
        cta: 'input'
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

  ngAfterViewInit(){
    let selector = window.innerWidth <= 768 ? 'app-landing > div.main-landing.visible-xs' : 'app-landing > div.main-landing.hidden-xs';
    this.scrollPages = Array.prototype.filter.call( document.querySelectorAll(selector), (item)=>{
      return  item.style.display!='none'}
      )
    this.maxPages = this.scrollPages.length;
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

   

    let target = this.scrollPages[this.pager];
    scrollIntoViewIfNeeded.default(target,{
      centerIfNeeded:true,
      duration:500,
      easing:'easeIn'
    })

    this.pager = this.pager <= this.maxPages-1?  this.pager+1 : 0;
  }

  scrollBy(distance,page, duration) {

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
