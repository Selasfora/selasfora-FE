import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  genderList = [
    {title: 'Prefer to not specify'},
    {title: 'Male'},
    {title: 'Female'}
  ];
  user:any = {};

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
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password should at least be 8 digits',
      'maxlength': 'Max characters is 25'
    },
    dob: '',
    gender: ''
  };

  formErrors = {
    'fname': [],
    'lname': [],
    'phone': [],
    'email': [],
    'dob': [],
    'password': [],
    'gender': []
  };

  errorMessage: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private userService: UserService) { }

  ngOnInit() {
    if(!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.user = this.userService.getUser();
    this.profileForm = this.fb.group({
      fname: [this.user.first_name, Validators.required],
      lname: [this.user.last_name, Validators.required],
      email: [this.user.email, [Validators.email, Validators.required]],
      dob: [''],
      phone: [this.user.phone, Validators.required],
      password: [this.user.password],
      gender: [this.user.gender]
    });
  }

  setGender(value) {
    this.profileForm.patchValue({gender: value.title});
  }

  backClick() {
    this._location.back();
  }

  validate() {

    let valid = true;
    const form = this.profileForm;

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
  onSubmit() {
    let valid = this.validate();
    let value = this.profileForm.value;
    if(valid) {
      let model: any = {};
      model.email = value.email;
      model.password = value.password;
      model.dob = value.dob;
      model.phone = value.phone;
      model.first_name = value.fname;
      model.last_name = value.lname;
      model.gender = value.gender;
      console.log('valid', model)
      // this.auth.saveUser(model)
      //   .subscribe(
      //     (data) => {
      //     },
      //     (error) => {
      //     }
      //   );
      return true;
    }
    console.log('invalid', value)
    return false;
  }

  logout() {
    this.userService.removeUser();
    this.user = null;
    this.auth.logout(null).subscribe().unsubscribe();
    return false;
  }

}