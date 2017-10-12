import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { WindowService } from './window.service';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  private baseURL = environment.apiPath;

  public isLoggedIn = false;

  private headers: any = {};

  private window: any;

  constructor(private http: Http, private _window: WindowService) {
    this.headers['Content-Type'] = 'application/json';
    this.window = _window.nativeWindow;

    if (this.window.user && this.window.user.session_token) {
      this.headers['Authorization'] = this.window.user.session_token;
    } else if (this.window.sessionStorage.getItem('Authorization')) {
      this.headers['Authorization'] = this.window.sessionStorage.getItem('Authorization');
    }
  }

  setAuthHeader(token) {
    this.headers['Authorization'] = token;
  }

  removeAuthHeader() {
    delete this.headers['Authorization'];
  }

  login(data) {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = this.baseURL + 'users/login';
    const method = 'post';

    return this.sendRequest(method, url, data, { headers: headers });
  }

  signup(data) {
    const url = this.baseURL + 'users';
    const method = 'post';

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  registerSocialUser(data) {
    const url = this.baseURL + 'users/signup/' + data.provider;
    const method = 'post';

    return this.sendRequest(method, url, data, null);
  }

  logout(data) {
    const url = this.baseURL + 'users/' + data.id + '/logout';
    const method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  resetPassword(data) {
    const url = this.baseURL + 'users/reset_password';
    const method = 'post';

    return this.sendRequest(method, url, {
      'redirect_url': 'http://selasfora.surge.sh/reset-password?step=2',
      'email': data.email
    }, undefined);
  }

  setPassword(data) {
    const url = this.baseURL + 'users/reset_password';
    const method = 'put';
    this.headers.append('access-token', data.token);
    this.headers.append('uid', data.uid);
    this.headers.append('client', data.client_id);

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  fetchProducts(type) {
    const url = this.baseURL + 'products?product_type=' + type +'&page=1&limit=9';
    return this.sendRequest('get', url, {}, null);
  }

  fetchProduct(id) {
    const url = this.baseURL + 'products/' + id;
    return this.sendRequest('get', url, {}, null);
  }

  fetchFilters() {
    const url = this.baseURL + 'products/filters';
    return this.sendRequest('get', url, {}, null);
  }

  fetchJournal() {
    const url = this.baseURL + 'articles?page=1&limit=9';
    return this.sendRequest('get', url, {}, null);
  }

  fetchArticle(id) {
    const url = this.baseURL + 'articles/' + id;
    return this.sendRequest('get', url, {}, null);
  }

  queryProducts(query) {
    const url = this.baseURL + 'products/search' + query;
    return this.sendRequest('get', url, {}, null);
  }

  newsLetter(email) {
    const url = this.baseURL + 'newsletters';
    return this.sendRequest('post', url, {'email': email}, null);
  }

  saveUser(user) {
    const url = this.baseURL + 'users/' + user.id;
    return this.sendRequest('put', url, user, this.headers);
  }

  fetchUser(id) {
    const url = this.baseURL + 'users/' + id;
    return this.sendRequest('get', url, {}, null);
  }

  resendEmail() {
    const url = this.baseURL + 'users/confirmation';
    return this.sendRequest('post', url, {}, null);
  }

  fetchReport() {
    return this.sendRequest('get', this.baseURL + '/newsletters', {}, null);
  }

  contactSubmit(data) {
    const url = this.baseURL + 'contact-us';
    return this.sendRequest('post', url, data, null);
  }

  sendRequest(method, url, data, options): Observable<any> {
    const auth = {headers: this.headers};
    if (method !== 'get' && method !='delete') {
      return this.http[method](url, data, auth)
        .map(res => res.json());
    } else {
      return this.http[method](url, auth)
        .map(res => res.json());
    }
  }
}
