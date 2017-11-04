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
      'required': 'ERROR_EMAIL_REQUIRED',
      'email': 'ERROR_EMAIL_INVALID'
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
  email = '';
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
        this.reset_password_token = params['auth'];
        this.step = this.reset_password_token ? 2 : 1;
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
        this.email = this.loginForm.get('email').value;
        this.auth.resetPassword(this.loginForm.get('email').value)
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
        this.resultText = 'ERROR_ALL_FIELDS_REQUIRED';
        return false;
      }
      if(p1 != p2) {
        this.resultClass = 'error';
        this.resultText = 'ERROR_PASSWORDS_DONT_MATCH';
        return false;
      }
      this.auth.setPassword({
        password: p1,
        email: this.email,
        reset_password_token: this.reset_password_token,
      }).subscribe(
          (data) => {
            this.router.navigate(['/login']);
          },
          (error) => {
            this.resultClass = 'error';
            // TODO : google translate 
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
