import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { routing } from './app.routes';

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

import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

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
    MenuComponent,
    CatalogComponent,
    ProductComponent,
    FooterComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    Angular2SocialLoginModule,
    Ng2PageScrollModule.forRoot()
  ],
  providers: [
    AuthService,
    WindowService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
