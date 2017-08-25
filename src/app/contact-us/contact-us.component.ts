import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.less']
})
export class ContactUsComponent implements OnInit {

  validationMessages = {
    'name': {
      'required': 'name is required.',
    },
    'issue': {
      'required': 'Please select an issue',
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Please enter a valid email'
    },
    'subject': {
      'required': 'Please enter a subject'
    },
    'message': {
      'required': 'Please enter a message.'
    }
  };

  formErrors = {
    'name': [],
    'email': [],
    'issue': [],
    'subject': [],
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

  constructor(private fb: FormBuilder, private auth: AuthService, private _location: Location,
    private router: Router, private user: UserService, private toastrService: ToastrService) {

  }
  backClick() {
    this._location.back();
  }

  ngOnInit() {

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      subject: ['', [Validators.required]],
      issue: ['', Validators.required],
      message: ['', [Validators.required]]
    });
  }

  setIssueType(value) {
    this.contactForm.value.issue = value.title;
  }

  onSubmit() {
    let valid = this.validate();
    console.log('here')
    if(valid) {
    console.log('here')
      let model: any = {};
      let value = this.contactForm.value;
      model.from = value.email;
      model.name = value.name;
      model.subject = value.subject;
      model.issue = value.issue;
      model.message = value.message;
      this.auth.contactSubmit(model)
        .subscribe(
          (data) => {
            this.toastrService.success('We Receieved your concern and we will come back to you asap!', 'Success!');
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
