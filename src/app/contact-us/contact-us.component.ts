import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'toastr-ng2';
import {TranslateService} from "@ngx-translate/core"

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.less']
})
export class ContactUsComponent implements OnInit {

  validationMessages = {
    'name': {
      'required': 'ERROR_NAME_REQUIRED',
      'pattern': 'ERROR_ONLY_CHARACTERS',
      'maxlength': 'ERROR_NAME_MAXLENGTH'
    },
    // 'issue': {
    //   'required': 'Please select an issue',
    // },
    'email': {
      'required': 'ERROR_EMAIL_REQUIRED',
      'email': 'ERROR_EMAIL_INVALID'
    },
    'subject': {
      'required': 'ERROR_SUBJECT_REQUIRED'
    },
    'message': {
      'required': 'ERROR_MESSAGE_REQUIRED'
    }
  };

  formErrors = {
    'name': [],
    'email': [],
    'message': []
  };

  IssueList = [
    {title: 'My order'},
    {title: 'Delivery'},
    {title: 'Returns and Refunds'},
    {title: 'My account'},
    {title: 'A product question'},
    {title: 'Other'}
  ];

  errorMessage: string = '';
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location, private translate: TranslateService,
    private router: Router, private user: UserService, private toastrService: ToastrService) {

  }
  backClick() {
    this._location.back();
  }

  ngOnInit() {

    this.contactForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern(/[a-zA-z]/g)]],
      email: ['', [Validators.email, Validators.required]],
      issue: ['', Validators.required],
      message: ['', [Validators.required]]
    });
  }

  setIssueType(value) {
    this.contactForm.patchValue({issue: value.title});
  }

  onSubmit() {
    let valid = this.validate();
    if(valid) {
      let model: any = {};
      let value = this.contactForm.value;
      model.from = value.email;
      model.name = value.name;
      model.issue = value.issue;
      model.message = value.message;
      this.auth.contactSubmit(model)
        .subscribe(
          (data) => {
            this.translate.get("SUCCESS_CONTACT_US").subscribe((res:string)=>{
              
                          this.toastrService.success(
                            res,
                            'Success!'
                          );
                        })
        }
      );
    }
    return false;
  }

  validate() {
    let valid = true;
    const form = this.contactForm;

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
