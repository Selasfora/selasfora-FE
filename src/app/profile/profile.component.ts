import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'toastr-ng2';

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
  user: any = {};

  addresses = [1, 2];
  orders = [1, 2];

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

  errorMessage = '';
  arrows = ['up', 'down', 'down'];

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private userService: UserService, private toastrService: ToastrService) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
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

    this.userService.getAddresses().subscribe(
      data => {
        this.addresses = data;
      }
    );

    this.userService.getOrders().subscribe(
      data => {
        this.orders = data;
      }
    );

  }

  flipArrow(n) {
    this.arrows[n] = this.arrows[n] === 'up' ? 'down' : 'up';
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
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = [];
        const control = form.get(field);

        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            this.formErrors[field].push(messages[key]);
            valid = false;
          }
        }
      }
    }
    return valid;
  }
  onSubmit() {
    const valid = this.validate();
    const value = this.profileForm.value;
    if (valid) {
      const model: any = {};
      model.id = this.user.id;
      model.email = value.email;
      if (value.password) {
        model.password = value.password;
      }
      model.dob = value.dob;
      model.phone = value.phone;
      model.first_name = value.fname;
      model.last_name = value.lname;
      model.gender = value.gender[0].toUpperCase();

      this.auth.saveUser(model)
        .subscribe(
          (data) => {
            this.userService.persistUser(data);
            this.toastrService.success(
              'Your Profile was saved successfully!',
              'Success!'
            );
          },
          (error) => {
            this.toastrService.error(
              'Something went wrong, couldn\'t save profile!',
              'Error!'
            );
          }
        );
      return true;
    }

    return false;
  }

  logout() {
    this.userService.removeUser();
    this.user = null;
    this.auth.logout(null).subscribe().unsubscribe();
    return false;
  }

}