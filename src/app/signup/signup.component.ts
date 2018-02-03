import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import {TranslateService} from '@ngx-translate/core'
import {ToastrService} from 'toastr-ng2'
declare var clevertap:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  sentConfirmation: boolean = false;

  validationMessages = {
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
    'email2': {
      'required': 'ERROR_REPEAT_EMAIL_REQUIRED',
      
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

  formErrors = {
    'fname': [],
    'lname': [],
    'email': [],
    'email2': [],
    'password': [],
    'password2': []
  };

  errorMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private user: UserService, private translate:TranslateService, private toastrService:ToastrService) {

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

  backClick() {
    if(this.sentConfirmation) {
      this.sentConfirmation = false;
    } else {
      this._location.back();
    }
  }

  ngOnInit() {
    if(this.user.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.signupForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      email2: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength, Validators.maxLength]],
      password2: ['', [Validators.required, Validators.minLength, Validators.maxLength]]
    });
  }

  onSubmit() {
    let valid = this.validate();
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



  validate() {

    let valid = true;
    const form = this.signupForm;

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

    if(this.signupForm.get('email2').value != this.signupForm.get('email').value){
      this.formErrors['email2'].push('ERROR_EMAIL_NOT_MATCHING');
      valid = false
    }

    if(this.signupForm.get('password2').value != this.signupForm.get('password').value){
      this.formErrors['password2'].push('ERROR_PASSWORD_NOT_MATCHING');
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
