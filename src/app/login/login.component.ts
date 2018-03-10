import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { UserService } from '../user.service';
import { Location } from '@angular/common';
import { Angular2SocialLoginModule, AuthService as socialServie } from "angular2-social-login";
import { Router } from '@angular/router';
import {ToastrService} from 'toastr-ng2'
import {TranslateService} from '@ngx-translate/core'
declare var clevertap: any;

let providers = {
  "google": {
    "clientId": "814388612429-08gadhpq9fjke5a8te1n4ib2d8r1jfia.apps.googleusercontent.com"
  },
  "facebook": {
    "clientId": "1764432773591047",//"145840142803938",
    "apiVersion": "v2.4"
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


  signupFormErrors = {
    'fname': [],
    'lname': [],
    'email': [],
    'password': [],
    'password2': []
  };

  window: any;
  subscription: any;

  signupForm: FormGroup;

  sentConfirmation: boolean = false;

  signupValidationMessages = {
    'fname': {
      'required': 'ERROR_FIRST_NAME_REQUIRED',
      'pattern': 'ERROR_ONLY_CHARACTERS',
      'maxlength': 'ERROR_FNAME_MAXLENGTH'
    },
    'lname': {
      'required': 'ERROR_LAST_NAME_REQUIRED',
      'pattern': 'ERROR_ONLY_CHARACTERS',
      'maxlength': 'ERROR_LNAME_MAXLENGTH'
    },
    'email': {
      'required': 'ERROR_EMAIL_REQUIRED',
      'email': 'ERROR_EMAIL_INVALID'
    },
    'password': {
      'required': 'ERROR_PASSWORD_REQUIRED',
      'minlength': 'ERROR_PASSWORD_SHORT',
      'maxlength': 'ERROR_PASSWORD_LONG'
    },
    'password2': {
      'required': 'ERROR_REPEAT_PASSWORD_REQUIRED',

    }
  };


  errorMessage: string = '';


  constructor(private fb: FormBuilder, private auth: AuthService,
    private _location: Location, private $window: WindowService,
    private _auth: socialServie, private user: UserService, private router: Router,private toastrService:ToastrService, private translate:TranslateService) {
    this.window = $window.nativeWindow;
    this.addFB();

          // check for confirmation router
          router.events.subscribe((event:any)=>{
            let d = router.parseUrl(event.url);
              if(d.queryParams.hasOwnProperty('verificationCode')){
                this.sentConfirmation = true;
                let email = encodeURIComponent( d.queryParams['email']);
                let code = d.queryParams['verificationCode'];
    
                this.auth.verifyEmail(email,code).subscribe(res=>{
                  this.user.persistUser(res);
                  clevertap.event.push("User signup",{
                    "Email confirmed":"confrimed"
                  });
    
                  this.translate.get("SUCCESS_EMAIL_CONFIRMED").subscribe((res:string)=>{
                    
                                this.toastrService.success(
                                  res,
                                  'Success!'
                                );
                              })
    
                  router.navigate(["/"])
    
                },err=>{
                  router.navigate(["/login"]);
                })
                // tell clever tap that email was verified 
              
    
    
               
                
              }
          })
  }

  signIn(provider) {

    this.formErrors.password = [];

    this.subscription = this._auth.login(provider)
      .subscribe(
      (data: any) => {


        let payload = {
          access_token: data.token,
          refresh_token: data.token,
          provider: 'google'

        }
        this.auth.registerSocialUser(payload).subscribe((data) => {
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

    
    this.signupForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength, Validators.maxLength]],
      password2: ['', [Validators.required, Validators.minLength, Validators.maxLength]]
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


          this.router.navigate(['/']);
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
                provider: 'facebook'

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



// signup funtions 

onSubmitSignup() {
  let valid = this.validateSignup();
  if(valid) {
    let model: any = {};
    let value = this.signupForm.value;
    model.email = value.email;
    model.password = value.password;
    model.password_confirmation = value.password2;
    model.first_name = value.fname;
    model.last_name = value.lname;
    this.auth.signup(model)
      .subscribe(
        (data) => {
          this.sentConfirmation = true;

          // send user signed up
          clevertap.event.push("User signup",{
            "Email confirmed":"pending",
            "email": value.email,
            "user name": value.fname +" "+ value.lname
          });
        },
        (error) => {

          let errMessage = error.error.message;
          this.errorMessage = "";
          if(errMessage == "Email has already been taken")
            this.formErrors.email.push(errMessage);
            else
          this.errorMessage = errMessage;
          // tell clever tap there was a signup error
             // send user signed up
             clevertap.event.push("User signup failed",{
              "Error message":errMessage
            });
        }
      );
  }
  return false;
}


validateSignup() {
  
      let valid = true;
      const form = this.signupForm;
  
      for (const field in this.signupFormErrors) {
        // clear previous error message (if any)
        this.signupFormErrors[field] = [];
        const control = form.get(field);
  
        const messages = this.signupValidationMessages[field];
        for (const key in control.errors) {
          this.signupFormErrors[field].push(messages[key]);
          valid = false;
        }
  
      }

  
      if(this.signupForm.get('password2').value != this.signupForm.get('password').value){
        this.signupFormErrors['password2'].push('ERROR_PASSWORD_NOT_MATCHING');
        valid = false
      }
  
      return valid;
    }


    resend() {
      this.auth.resendEmail().subscribe(
        (data) => {
          clevertap.event.push("User signup",{
            "Email confirmed":"resend confirmation email"
          });
  
          this.router.navigate(['/']);
        }
      );
    }

}
