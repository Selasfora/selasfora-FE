import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';

@Injectable()
export class FiltersService {

  public filters: BehaviorSubject<any> = new BehaviorSubject({});
  public open: BehaviorSubject<boolean> =  new BehaviorSubject(false);
  public query: BehaviorSubject<string> =  new BehaviorSubject('');

  constructor() { }

}
