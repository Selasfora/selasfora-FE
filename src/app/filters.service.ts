import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class FiltersService {

  public filters: BehaviorSubject<any> = new BehaviorSubject({});
  public open: BehaviorSubject<boolean> =  new BehaviorSubject(false);

  constructor() { }

}
