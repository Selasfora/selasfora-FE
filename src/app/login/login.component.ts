import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Angular2SocialLoginModule, AuthService as socialServie } from "angular2-social-login";
import { Router } from '@angular/router';

let providers = {
  "google": {
    "clientId": "561313107749-flfhdb086rglddft350c1c8e3aolju6c.apps.googleusercontent.com"
  }
};
Angular2SocialLoginModule.loadProvidersScripts(providers);

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Please enter a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password should at least be 6 digits',
      'maxlength': 'Max characters is 25'
    }
  };

  formErrors = {
    'email': [],
    'password': []
  };

  window: any;
  subscription: any;

  constructor(private fb: FormBuilder, private auth: AuthService,
    private _location: Location, private $window: WindowService,
    private _auth: socialServie, private user: UserService, private router: Router) {
    this.window = $window.nativeWindow;
    this.addFB();
  }

  signIn(provider) {
    this.subscription = this._auth.login(provider)
    .subscribe(
      (data) => {
        this.user.persistUser(data);
      }
    )
  }

  logout() {
    this._auth.logout().subscribe(
      (data) => {
        //return a boolean value.
        this.user.removeUser();
      }
    )
  }

  private addFB() {
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    this.fbSetup();
  }

  backClick() {
    this._location.back();
  }

  onBlur(field) {
    this.formErrors[field] = [];
    const control = this.loginForm.get(field);
    if(!control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        this.formErrors[field].push(messages[key]);
      }
    }
  }

  ngOnInit() {
    if(this.user.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength, Validators.maxLength]]
    });
  }

  onSubmit() {
    let valid = this.validate();
    if(valid) {
      this.auth.login(this.loginForm.value)
        .map ((data: any) => data.data)
        .subscribe((data) => {
          this.user.persistUser(data);
          this.router.navigate(['/']);
        });
    }
    return false;
  }

  validate() {
    let valid = true;
    const form = this.loginForm;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = [];
      const control = form.get(field);

      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        this.formErrors[field].push(messages[key]);
        valid = false;
      }
    }
    return valid;
  }

  fbSetup() {
    let appKey = '1389149917845163';
    let appSecret = 'c3c48939366edcb08f20f354455bb080';

    this.window.fbAsyncInit = function() {
      this.window.FB.init({
        appId: appKey,
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.4'
      });
    };
  }

  facebook() {
    this.window.FB.login();
  }

  twitter() {

  }

}
