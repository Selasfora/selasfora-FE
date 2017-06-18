import { Injectable } from '@angular/core';

function getWindow (): any {
    return window;
}

@Injectable()
export class WindowService {

  constructor() { }
  get nativeWindow (): any {
        return getWindow();
    }
}
