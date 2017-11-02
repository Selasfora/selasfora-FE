import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HttpClient } from '@angular/common/http';
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
import { CartService } from './cart.service';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { MenuComponent } from './menu/menu.component';

import { Angular2SocialLoginModule } from 'angular2-social-login';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { Ng2PageScrollModule } from 'ng2-page-scroll';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';

import { CatalogComponent } from './catalog/catalog.component';
import { ProductComponent } from './product/product.component';
import { FooterComponent } from './footer/footer.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { JournalComponent } from './journal/journal.component';
import { PostComponent } from './post/post.component';
import { ArticleComponent } from './article/article.component';
import { FiltersMenuComponent } from './filters-menu/filters-menu.component';
import {ShippingMenuComponent} from './shipping-menu/shipping-menu.component'
import { AboutComponent } from './about/about.component';
import { ReportComponent } from './report/report.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SizeGuideComponent } from './size-guide/size-guide.component';
import { ProfileComponent } from './profile/profile.component';
import { AddressComponent } from './profile/address/address.component';
import { MixmatchComponent } from './mixmatch/mixmatch.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { TimelineComponentComponent } from './order-tracking/timeline-component/timeline-component.component';

// angular translate module 
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    AboutComponent,
    ReportComponent,
    DropdownComponent,
    SizeGuideComponent,
    ProfileComponent,
    AddressComponent,
    MixmatchComponent,
    ShippingMenuComponent,
    OrderTrackingComponent,
    TimelineComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    Angular2SocialLoginModule,
    Ng2PageScrollModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SlimLoadingBarModule.forRoot(),
    DragulaModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [
    AuthService,
    WindowService,
    UserService,
    FiltersService,
    CartService
  ],
  exports: [BrowserModule, SlimLoadingBarModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
