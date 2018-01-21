import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Angular2SocialLoginModule, AuthService as socialServie } from "angular2-social-login";
import { Router } from '@angular/router';
declare var clevertap: any;

let providers = {
  "google": {
    "clientId": "814388612429-08gadhpq9fjke5a8te1n4ib2d8r1jfia.apps.googleusercontent.com"
  },
  "facebook":{
    "clientId":"1764432773591047",//"145840142803938",
    "apiVersion":"v2.4"
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
  googleKey: string;
  validationMessages = {
    'email': {
      'required': 'ERROR_EMAIL_REQUIRED',
      'email': 'ERROR_EMAIL_INVALID'
    },
    'password': {
      'required': 'ERROR_PASSWORD_REQUIRED',
      'minlength': 'ERROR_PASSWORD_SHORT',
      'maxlength': 'ERROR_PASSWORD_LONG'
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

    this.formErrors.password = [];

    this.subscription = this._auth.login(provider)
      .subscribe(
      (data:any) => {
 

        let payload = {
          access_token: data.token,
          refresh_token: data.token,
          provider : 'google'
          
        }
        this.auth.registerSocialUser(payload).subscribe((data)=>{
          this.user.persistUser(data);
          this.window.location.href = '/';
  
          clevertap.event.push("google login");
          
                        clevertap.profile.push({
                          "Google": data
                        });
  
  
        })


      },
      err => {
        console.log("login error", err)
        this.formErrors.password.push("ERROR_INVALID_USER_PASSWORD")
      },
      () => { 
        console.log()
      }
      )
  }

  logout() {
    let that = this;
    this.window.FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        that.window.FB.logout();
      }
    });

    this._auth.logout().subscribe(
      (data) => {
        //return a boolean value.
        this.user.removeUser();
        clevertap.event.push("logout");
        this.router.navigate(['/']);
        location.reload();
      }
    )
    this.auth.removeAuthHeader();
  }

  private addFB() {
    (function (d, s, id) {
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
    if (this.user.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength, Validators.maxLength]]
    });
  }

  onSubmit() {
    this.formErrors.password = [];
    let valid = this.validate();
    if (valid) {
      this.auth.login(this.loginForm.value)
        .subscribe((data) => {
          this.auth.setAuthHeader(data.session_token)
          this.user.persistUser(data);


          // push the profile to clever tap
          let profileData = Object.assign({}, data);
          delete profileData.session_token;

          clevertap.profile.push({
            "Site": profileData
          });



          clevertap.event.push("login");


          this.window.location.href = '/';
        },
        err => {
          this.formErrors.password.push("ERROR_INVALID_USER_PASSWORD")
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
    let appKey = '1764432773591047';
    let appSecret = '5b0f32267315e8a183db34ef223373eb';

    this.window.fbAsyncInit = function () {
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
    let accessToken = null;

   
        // the user isn't logged in to Facebook.
        this.window.FB.login(function (response) {
          accessToken = response.authResponse.accessToken;
          let res = response;
          console.log('res', res);
          if (response && !response.error) {
            that.window.FB.api(
              response.authResponse.userID,
              function (response) {
                if (response && !response.error) {
                  response.provider = 'facebook';
                  if (!response.email) {
                    response.email = response.id + '@facebook.com'
                  }
                  response.uid = response.id;
                  delete response.id;
                  let payload = {
                    access_token: accessToken,
                    refresh_token: accessToken,
                    provider : 'facebook'
                    
                  }
                  
                  that.auth.registerSocialUser(payload).subscribe(
                    (data) => {
                      that.user.persistUser(data);
                      //that.router.navigate(['/']);
                      that.window.location.href = '/';

                      clevertap.event.push("facebook login");

                      clevertap.profile.push({
                        "Facebook": data
                      });


                    }
                  );
                }
              }, { fields: 'name, first_name, last_name, email' }
            );
          }
        }, { scope: 'public_profile,email' });
      
   
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
