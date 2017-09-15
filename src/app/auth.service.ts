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
    let url = this.baseURL + 'users/login';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  signup(data) {
    let url = this.baseURL + 'users';
    let method = 'post';

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  registerSocialUser(data) {
    console.log('register user', data)
    let url = this.baseURL + 'users/signup/' + data.provider;
    let method = 'post';

    return this.sendRequest(method, url, data, null);
  }

  logout(data) {
    console.log('logout user', data)
    let url = this.baseURL + 'users/' + data.id + '/logout';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  resetPassword(data) {
    let url = this.baseURL + 'users/reset_password';
    let method = 'post';

    return this.sendRequest(method, url, {
      'redirect_url': 'http://selasfora.surge.sh/reset-password?step=2',
      'email': data.email
    }, undefined);
  }

  setPassword(data) {
    let url = this.baseURL + 'users/reset_password';
    let method = 'put';
    this.headers.append('access-token', data.token);
    this.headers.append('uid', data.uid);
    this.headers.append('client', data.client_id);

    return this.sendRequest(method, url, data, { headers: this.headers });
  }

  fetchProducts(type) {
    let url = this.baseURL + 'products?product_type=' + type +'&page=1&limit=9';
    return this.sendRequest('get', url, {}, null);
  }

  fetchProduct(id) {
    let url = this.baseURL + 'products/' + id;
    return this.sendRequest('get', url, {}, null);
  }

  fetchFilters() {
    let url = this.baseURL + 'products/filters';
    return this.sendRequest('get', url, {}, null);
  }

  fetchJournal() {
    let url = this.baseURL + 'articles?page=1&limit=9';
    return this.sendRequest('get', url, {}, null);
  }

  fetchArticle(id) {
    let url = this.baseURL + 'articles/' + id;
    return this.sendRequest('get', url, {}, null);
  }

  queryProducts(query) {
    let url = this.baseURL + 'products/search' + query;
    return this.sendRequest('get', url, {}, null);
  }

  newsLetter(email) {
    let url = this.baseURL + 'newsletters';
    return this.sendRequest('post', url, {'email': email}, null);
  }

  sendRequest(method, url, data, options): Observable<any> {
    return this.http[method](url, data, options)
      .map(res => res.json());
  }

  resendEmail() {
    let url = this.baseURL + 'users/confirmation';
    return this.sendRequest('post', url, {}, null);
  }

  fetchReport() {
    return this.sendRequest('get', this.baseURL + '/newsletters', {}, null);
  }

  contactSubmit(data) {
    let url = this.baseURL + 'contact-us';
    return this.sendRequest('post', url, data, null);
  }
}
