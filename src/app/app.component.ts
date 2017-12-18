import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WindowService } from './window.service';
import { AuthService } from './auth.service';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DynamicTranslationService } from './dynamic-translation.service';
declare var anime: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  window: any;

  constructor(private router: Router, private _window: WindowService, auth: AuthService, translate: TranslateService, private dynamicTranslation: DynamicTranslationService) {


    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // detect the user's language and then set the translation:

    let userLang = navigator.language.split("-")[0];

    // set the default language of the translation serve
    translate.use(userLang)
    dynamicTranslation.setLang(userLang)

    // make sure that the dynamic translation service is set to the same lang as ngx-translate
    translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
      dynamicTranslation.setLang(event.lang);
    });


    router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.window = _window.nativeWindow;
          this.window.scrollTo(0, 0);
          if (this.window.user && this.window.user.session_token) {
            if (!this.window.sessionStorage.getItem('Authorization')) {
              this.window.sessionStorage.setItem('Authorization', this.window.user.session_token);
              auth.setAuthHeader(this.window.user.session_token);
            }
          }
        }
      }
    )
  }


  ngAfterViewInit() {
    // hide the splash screen


   var clock = setInterval(()=>{
     

      let splash:any = document.querySelector('.splash');
      if(!splash) return
      
      var img = new Image();
    
      img.src = '/assets/images/logo.png';
  

      

      img.onload= ()=>{

       clearInterval(clock);

          let timeLine = anime.timeline();

          if (window.innerWidth <= 420) {

            timeLine.add({
              targets: '.splash',
              translateX: '-3px',
              translateY: '-39vh',
              easing: 'easeOutExpo',
              scale: 1
            })
              .add({
                targets: '.vertical-align',
                opacity: 0,
                easing: 'easeOutExpo'
              })
              .add({
                targets: '.vertical-align',
                zIndex: -1,
                easing: 'easeOutExpo'
              })
              .add({
                targets: 'app-header div > *:not(.splash)',
                opacity: 1,
                easing: 'easeOutExpo'
              });
          }
          else {



            timeLine.add({
              targets: '.splash',
              translateX: '-3px',
              translateY: '-42vh',
              easing: 'easeOutExpo',
              scale:1
            })
              .add({
                targets: '.vertical-align',
                opacity: 0,
                easing: 'easeOutExpo'
              })
              .add({
                targets: 'app-header div > *:not(.splash)',
                opacity: 1,
                easing: 'easeOutExpo'
              });

          }

          timeLine.complete = this.splashCallback;
        };

        splash.src = img.src;
  
        },500)

      }

      

      splashCallback = ()=>{
        let afterAnimationStyles = `
          
      app-header div > *:not(.splash){
        opacity: 1;
       
       }
       .splash{
       position: absolute!important;
       transform: translateX(-3px) translateY(-42vh)!important;
        transform: scale(1);
        z-index: 1000;
       margin:auto;
       left:0;
       right:0;
       color:transparent;
       }

       @media screen and (max-width:768px){
         .splash{
          transform: translateX(-3px) translateY(-39vh)!important;
         }
       }
 
        `;

        let styleEle = document.createElement('style');
        styleEle.innerText = afterAnimationStyles;
        document.head.appendChild(styleEle)
      };

    

}

