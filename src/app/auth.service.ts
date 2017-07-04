import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  private baseURL = environment.apiPath;

  public isLoggedIn = false;

  private headers: Headers = new Headers();

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/json');
  }

  login(data) {
    let url = this.baseURL + 'auth/sign_in';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  signup(data) {
    let url = this.baseURL + 'auth';
    let method = 'post';

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  registerSocialUser(data) {
    let url = this.baseURL + 'users/update';
    let method = 'post';

    return this.sendRequest(method, url, data, null);
  }

  logout(data) {
    let url = this.baseURL + 'auth/sign_out';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  resetPassword(data) {
    let url = this.baseURL + 'auth/password';
    let method = 'post';

    return this.sendRequest(method, url, {
      'redirect_url': environment.urlPath + '/reset-password?step=2',
      'email': data.email
    }, undefined);
  }

  setPassword(data) {
    let url = this.baseURL + 'auth/password';
    let method = 'put';
    this.headers.append('access-token', data.token);
    this.headers.append('uid', data.uid);
    this.headers.append('client', data.client_id);

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  sendRequest(method, url, data, options): Observable<any> {
    return this.http[method](url, data, options)
      .map(res => res.json());
  }

  resendEmail() {
    return this.sendRequest('post', '/auth/confirmation', {}, null);
  }
}
