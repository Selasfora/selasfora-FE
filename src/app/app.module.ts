import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastrModule } from 'toastr-ng2';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { FiltersService } from './filters.service';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { MenuComponent } from './menu/menu.component';

import { Angular2SocialLoginModule } from "angular2-social-login";

import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { JournalComponent } from './journal/journal.component';
import { PostComponent } from './post/post.component';
import { ArticleComponent } from './article/article.component';
import { FiltersMenuComponent } from './filters-menu/filters-menu.component';
import { AboutComponent } from './about/about.component';

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
    ContactUsComponent,
    ProductDetailsComponent,
    JournalComponent,
    PostComponent,
    ArticleComponent,
    FiltersMenuComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    Angular2SocialLoginModule,
    Ng2PageScrollModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AuthService,
    WindowService,
    UserService,
    FiltersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
