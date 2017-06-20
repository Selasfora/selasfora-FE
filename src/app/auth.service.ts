import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  private baseURL = 'https://selasfora-dev.herokuapp.com/';

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

  logout(data) {
    let url = this.baseURL + 'auth/sign_out';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  resetPassword(data) {
    let url = this.baseURL + 'auth/password';
    let method = 'post';

    return this.sendRequest(method, url, data, undefined);
  }

  sendRequest(method, url, data, options): Observable<any> {
    return this.http[method](url, data, options)
      .map(res => res.json());
  }
}
