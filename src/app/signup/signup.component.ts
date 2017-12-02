import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
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
    },
    'lname': {
      'required': 'ERROR_LAST_NAME_REQUIRED',
    },
    'phone': {
      'required': 'ERROR_PHONE_REQUIRED',
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
    'phone': [],
    'email': [],
    'email2': [],
    'password': [],
    'password2': []
  };

  errorMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private user: UserService) {

      // check for confirmation router
      router.events.subscribe((event:any)=>{
        let d = router.parseUrl(event.url);
          if(d.queryParams.hasOwnProperty('verificationCode')){
            this.sentConfirmation = true;
            let email = d.queryParams['email'];
            let code = d.queryParams['verificationCode'];

            // tell clever tap that email was verified 
            clevertap.event.push("User signup",{
              "Email confirmed":"confrimed"
            });


            router.navigate(["/login"]);
            
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
      phone: ['', Validators.required],
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
      model.phone = value.phone;
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
              "user name": value.fname +" "+ value.lname,
              "user phone": value.phone
            });
          },
          (error) => {
            this.errorMessage = error.json().errors ? error.json().errors.full_messages[0] : error.json().message;

            // tell clever tap there was a signup error
               // send user signed up
               clevertap.event.push("User signup failed",{
                "Error message":this.errorMessage
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
