import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { WindowService } from './window.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  /*host: {'class': 'col-xs-12'}*/
})
export class AppComponent {
  window: any;

  constructor(private router: Router, private _window: WindowService) {
    router.events.subscribe(
      (event) => {
        if(event instanceof NavigationEnd) {
          this.window = _window.nativeWindow;
          this.window.scrollTo(0, 0);
        }
      }
    )
  }
}
