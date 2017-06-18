import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {Location} from '@angular/common';

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

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location) {

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

    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength, Validators.maxLength]]
    });
  }

  onSubmit() {
    let valid = this.validate();
    if(valid) {
      this.auth.login(this.loginForm.value)
        .subscribe((data) => console.log(data));
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

}
