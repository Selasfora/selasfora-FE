import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WindowService } from './window.service';
import { AuthService } from './auth.service';
import {TranslateService,TranslationChangeEvent} from '@ngx-translate/core';
import {DynamicTranslationService} from './dynamic-translation.service';

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
}
