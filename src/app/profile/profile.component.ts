import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'toastr-ng2';
import {TranslateService} from "@ngx-translate/core"
declare var window:any;
declare var clevertap:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  genderList = [
    { title: 'Prefer to not specify' },
    { title: 'Male' },
    { title: 'Female' }
  ];
  user: any = {};
  datePickerOptions:{
    min:""
  }
  addresses = [];
  orders:any = [1, 2];
  formSubmitted = false;
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
    'password': {
      'required': 'ERROR_PASSWORD_REQUIRED',
      'minlength': 'ERROR_PASSWORD_SHORT',
      'maxlength': 'ERROR_PASSWORD_LONG'
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
    private router: Router, private userService: UserService, private toastrService: ToastrService, private translate:TranslateService) { }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.user = this.userService.getUser();
    let gender = this.genderList.find(g=> g.title.toUpperCase().indexOf(this.user.gender) >=0 );
    this.user.gender = gender? gender.title : "Prefer not to specify";
    this.profileForm = this.fb.group({
      fname: [this.user.first_name, Validators.required],
      lname: [this.user.last_name, Validators.required],
      email: [this.user.email, [Validators.email, Validators.required]],
      dob: [this.user.dob ? this.user.dob.split('T')[0] : null,[Validators.required]],
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

        /**
         * get images related to the orders 
         */
        
        this.orders = data.orders;
        let orders = this.orders;

        orders.map((order,oIndex,arr)=>{
          let line_items = order.line_items;
          line_items.map((line_item,iIndex,arr)=>{
            this.auth.fetchProduct(line_item.product_id).subscribe(product=>{
              this.orders[oIndex].line_items[iIndex].img = product.image.src;
              if(iIndex == 0){
                this.orders[oIndex].img = product.image.src;
              }
            })
          })
        })

      }
    );

  }

  onlyNumbers(val){
    let n = this.profileForm.get('phone').value;
    n = n.replace(/[^0-9]/g,"");
    this.profileForm.get('phone').setValue(n ? parseInt(n) : null);

  }

  viewOrder(order){
    this.userService.setOrderHistoryItem(order);
     // inform clever tap
     clevertap.event.push("order history item viewd",{
      "order id":order.id
    })
    this.router.navigate(["/profile/orders/details"]);
  }

  flipArrow(n) {
    this.arrows[n] = this.arrows[n] === 'up' ? 'down' : 'up';
  }

  setGender(value) {
    this.profileForm.patchValue({ gender: value.title });
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

    // check if the date is invalid 
    let dob = form.get("dob").value;
    valid = new Date( Date.parse(dob) ).getFullYear() <= (new Date()).getFullYear() ? true : false;
    if(!valid){
      this.formErrors.dob.push("Invalid date of birth");
    }
    return valid;
  }
  onSubmit() {
    this.formSubmitted = true;
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
      model.gender = value.gender[0].toUpperCase() == "P" ? "U" : value.gender[0].toUpperCase();
      this.formErrors = {
        'fname': [],
        'lname': [],
        'phone': [],
        'email': [],
        'dob': [],
        'password': [],
        'gender': []
      };
      this.auth.saveUser(model)
        .subscribe(
        (data) => {
          this.userService.persistUser(data);
          this.translate.get("SUCCESS_PROFILE_SAVE").subscribe((res:string)=>{

            this.toastrService.success(
              res,
              'Success!'
            );
          })

           // inform clever tap
           clevertap.event.push("user profile updated",model)
         
        },
        (error) => {

          this.translate.get("ERROR_PROFILE_SAVE").subscribe((res:string)=>{
            
                        this.toastrService.error(
                          res,
                          'Error!'
                        );
                      })

                      clevertap.event.push("user profile updated failed",model)
        
    
          this.formErrors = {
            'fname': [],
            'lname': [],
            'phone': [],
            'email': [],
            'dob': [],
            'password': [],
            'gender': []
          };
          this.formErrors[JSON.parse(error._body).validation.keys[0]].push(error.error.message)

        }
        );
      return true;
    }

    return false;
  }

  logout() {
   
   
        window.localStorage.clear();
         this.userService.removeUser();
        this.user = null;
        // tell clever tap that the user session has ended.
        clevertap.logout();
        // this.router.navigate(["/"]);
         location.href = location.origin;

    return false;
    
  }

  addAddress() {
    this.addresses.push(this.addresses.length + 1);
  }

  popAddress(index) {
    this.addresses.splice(index, 1);
  }
}