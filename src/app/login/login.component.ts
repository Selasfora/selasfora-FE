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
        let res:any = data;
        res.provider = 'google'
        this.auth.registerSocialUser(res);
        this.user.persistUser(res);
        this.window.location.href = '/';
      }
    )
  }

  logout() {
    let that = this;
    this.window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        that.window.FB.logout();
      }
    });

    this._auth.logout().subscribe(
      (data) => {
        //return a boolean value.
        this.user.removeUser();
      }
    )
    this.auth.removeAuthHeader();
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
        .subscribe((data) => {
          this.auth.setAuthHeader(data.session_token)
          this.user.persistUser(data);
          this.window.location.href = '/';
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
    let appKey = '253526608467931';
    let appSecret = 'c3a591cceb4382ccb4689df09837857a';

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
    let that = this;
    this.window.FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        that.window.FB.api(
          uid,
          function (response) {
            if (response && !response.error) {
              that.user.persistUser(response);
              //that.router.navigate(['/']);
              that.window.location.href = '/';
            }
          }
        );
      } else {
        // the user isn't logged in to Facebook.
        this.window.FB.login(function(response) {
          let res = response;
          console.log('res', res);
          if(response && !response.error) {
            that.window.FB.api(
              response.authResponse.userID,
              function (response) {
                if (response && !response.error) {
                  response.provider = 'facebook';
                  if(!response.email) {
                    response.email = response.id + '@facebook.com'
                  }
                  response.uid = response.id;
                  delete response.id;
                  console.log('response', response)
                  that.auth.registerSocialUser(response).subscribe(
                    (data) => {
                      that.user.persistUser(response);
                      //that.router.navigate(['/']);
                      that.window.location.href = '/';
                    }
                  );
                }
              }, {fields: 'name, first_name, last_name, email'}
            );
          }
        }, {scope: 'public_profile,email'});
      }
    });
  }

  twitter() {
    let key = '36r0UcbrGLXjCFMAVi9q0tLOW';
    let secret = 'ygOR3tY5Vc1hXhoQ0v3Sjmded323PEAgIe1hUTX5jscRce0T3j';

    this.auth.sendRequest('post', 'http://api.twitter.com/oauth/request_token', {
      oauth_callback: "http://localhost:4200/login",
      oauth_consumer_key: key,
      oauth_nonce: "ea9ec8429b68d6b77cd5600adbbb0456",
      oauth_signature: "F1Li3tvehgcraF8DMJ7OyxO4w9Y%3D",
      oauth_signature_method: "HMAC-SHA1"
    }, null).subscribe(
      (response) => {
        console.log(response)
        window.open('https://api.twitter.com/oauth/authenticate?oauth_token=' + response.oauth_token);
      }
    );

  }

}
