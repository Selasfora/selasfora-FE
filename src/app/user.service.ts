import { Injectable } from '@angular/core';
import { WindowService } from './window.service';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';

@Injectable()
export class UserService implements CanActivate, CanDeactivate<any> {
  private window: any;

  constructor(private $window: WindowService, private router: Router) {
    this.window = $window.nativeWindow;
    if(!this.window.user && this.window.localStorage.getItem('user')) {
      this.window.user = JSON.parse(this.window.localStorage.getItem('user'));
    }
  }

  persistUser(user: any) {
    this.window.user = user;
    if(this.window.localStorage && typeof this.window.localStorage === 'object') {
      this.window.localStorage.setItem('user', JSON.stringify(user));
    }
  }

  removeUser() {
    console.log('loggin out in service')
    this.window.user = undefined;
    if(this.window.localStorage && typeof this.window.localStorage === 'object') {
      this.window.localStorage.removeItem('user');
    }
  }

  getUser() {
    return this.window.user;
  }

  isLoggedIn() {
    return !!this.window.user;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('activate', this.isLoggedIn())
    if (this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

  canDeactivate() {
    console.log('deactivate', this.isLoggedIn())
    if(!this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

}
