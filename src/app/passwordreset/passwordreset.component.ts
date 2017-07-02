import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { WindowService } from '../window.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.less']
})
export class PasswordresetComponent implements OnInit {

  loginForm: FormGroup;

  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Please enter a valid email'
    }
  };

  formErrors = {
    'email': [],
  };

  resultClass = '';
  resultText = '';

  step = 1;
  subscription;
  reset_password_token = '';
  uid:any;
  client:any;
  window: any;

  constructor(private fb: FormBuilder, private auth: AuthService,
    private _location: Location, private router: Router,
    private route: ActivatedRoute, _window: WindowService) {
    this.window = _window.nativeWindow;
    router.events.subscribe((event) => {
      window.scrollTo(0, 0);
    });
  }

  backClick() {
    this._location.back();
  }

  ngOnInit() {

    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]]
    });

    this.subscription = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.reset_password_token = params['token'];
        this.client = params['client_id'];
        this.uid = this.window.unescape(params['uid']);
        this.step = params['step'];
        if(this.step == 2) {
          this.loginForm = this.fb.group({
            newPass: '',
            newPass2: ''
          });
        }
      });
  }

  onSubmit() {
    if(this.step != 2) {
      let valid = this.validate();
      if(valid) {
        this.auth.resetPassword(this.loginForm.value)
          .subscribe(
            (data) => {
              this.resultClass = 'success';
              this.resultText = data.message;
            },
            (error) => {
              this.resultClass = 'error';
              this.resultText = error.statusText;
            }
          );
      }
    } else {
      const form = this.loginForm;
      let p1 = form.get('newPass').value;
      let p2 = form.get('newPass2').value;
      if(!p1 || !p2) {
        this.resultClass = 'error';
        this.resultText = 'All fields are required';
        return false;
      }
      if(p1 != p2) {
        this.resultClass = 'error';
        this.resultText = 'Passwords don\'t match';
        return false;
      }
      this.auth.setPassword({
        password: p1,
        password_confirmation: p2,
        client_id: this.client,
        token: this.reset_password_token,
        uid: this.uid
      }).subscribe(
          (data) => {
            this.router.navigate(['/login']);
          },
          (error) => {
            this.resultClass = 'error';
            this.resultText = error.statusText;
          }
        );
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
