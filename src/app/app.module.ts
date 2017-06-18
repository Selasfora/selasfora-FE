import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { IconComponent } from './header/icon/icon.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { LoginComponent } from './login/login.component';

import { AuthService } from './auth.service';
import { WindowService } from './window.service';
import { UserService } from './user.service';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { MenuComponent } from './menu/menu.component';

import { Angular2SocialLoginModule } from "angular2-social-login";

const appRoutes: Routes = [
  {
    path: '',
    component: LandingpageComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    //canActivate: [UserService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
    //canActivate: [UserService]
  },

  {
    path: 'reset-password',
    component: PasswordresetComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    PageNotFoundComponent,
    HeaderComponent,
    IconComponent,
    LandingpageComponent,
    LoginComponent,
    SignupComponent,
    PasswordresetComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    Angular2SocialLoginModule
  ],
  providers: [
    AuthService,
    WindowService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
