import { Injectable } from '@angular/core';
import { WindowService } from './window.service';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, CanDeactivate } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable()
export class UserService implements CanActivate, CanDeactivate<any> {
  private window: any;
  private user: any;
  private baseURL = environment.apiPath;
  private orderHistoryItem:any = null;

  setOrderHistoryItem(item:any){
    this.orderHistoryItem = item;
  }

  getOrderHistoryItem(){
    return this.orderHistoryItem;
  }

  constructor(private $window: WindowService, private router: Router, private auth: AuthService) {
    this.window = $window.nativeWindow;
    if (!this.window.user && this.window.localStorage.getItem('user')) {
      this.window.user = JSON.parse(this.window.localStorage.getItem('user'));
      this.user = this.window.user;
    }
  }

  persistUser(user: any) {
    this.window.user = user;
    if (this.window.localStorage && typeof this.window.localStorage === 'object') {
      this.window.localStorage.setItem('user', JSON.stringify(user));
    }
  }

  removeUser() {
    console.log('loggin out in service')
    this.window.user = undefined;
    if (this.window.localStorage && typeof this.window.localStorage === 'object') {
      this.window.localStorage.removeItem('user');
    }
  }

  refreshUserInfo() {
    this.auth.fetchUser(this.window.user.id).subscribe(
      (data) => {
        this.persistUser(data);
      }
    )
  }

  getUser() {
    return this.window.user;
  }

  isLoggedIn() {
    return !!this.window.user;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

  canDeactivate() {
    if (!this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  saveAddress(address,id) {
    let url = this.baseURL + 'users/' +  this.user.id + '/addresses';
    let method = 'post';
    if (id) {
      method = 'put';
      url += "/"+id;
    }
    console.log('saving', address, 'method', method);
    return this.auth.sendRequest(method, url, address, this.auth.headers);
  }
  // { headers: {
  //     Authorization: this.window.sessionStorage.getItem('Authorization')
  //   }}
  removeAddress(id) {
    const url = this.baseURL + 'users/' +  this.user.id + '/addresses/' + id;
    const method = 'delete';

    
    return this.auth.sendRequest(method, url, {}, this.auth.headers);
  }

  getAddresses() {
    const url = this.baseURL + 'users/' +  this.user.id + '/addresses';
    const method = 'get';
    return this.auth.sendRequest(method, url, {}, this.auth.headers);
  }

  getOrders() {
    const url = this.baseURL + 'users/' +  this.user.id + '/orders';
    const method = 'get';
    return this.auth.sendRequest(method, url, {}, this.auth.headers);
  }

  cancelOrder(orderId){
    const url = `${this.baseURL}users/${this.user.id}/orders/${orderId}/cancel`;
    const method = "post";
    return this.auth.sendRequest(method,url,{},this.auth.headers);
  }

}
