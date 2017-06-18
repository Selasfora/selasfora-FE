import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  validationMessages = {
    'fname': {
      'required': 'First name is required.',
    },
    'lname': {
      'required': 'Last name is required.',
    },
    'phone': {
      'required': 'Phone is required.',
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Please enter a valid email'
    },
    'email2': {},
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password should at least be 6 digits',
      'maxlength': 'Max characters is 25'
    },
    'password2': {}
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

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private user: UserService) {
  }

  backClick() {
    this._location.back();
  }

  onBlur(field) {
    this.formErrors[field] = [];
    const control = this.signupForm.get(field);
    if(!control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        this.formErrors[field].push(messages[key]);
      }
    }
    if(field == 'email2' && this.signupForm.get('email').value != this.signupForm.get('email2').value) {
      this.formErrors['email'].push('Emails don\'t match');
    } else if(field == 'password2' && this.signupForm.get('password').value != this.signupForm.get('password2').value) {
      console.log(this.signupForm.get('password').value, this.signupForm.get('password2').value)
      this.formErrors['password'].push('Passwords don\'t match');
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
        .subscribe((data) => console.log(data));
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
    return valid;
  }

}
