import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutComponent } from './about/about.component';
import { JournalComponent } from './journal/journal.component';
import { ArticleComponent } from './article/article.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ReportComponent } from './report/report.component';
import { ProfileComponent } from './profile/profile.component';
import { MixmatchComponent } from './mixmatch/mixmatch.component';
import {OrderTrackingComponent} from './order-tracking/order-tracking.component';
import {CartComponent} from './cart/cart.component';
const appRoutes: Routes = [
  {
    path: 'catalog/:type',
    component: CatalogComponent,
  },
  {
    path: 'catalog/:type/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'profile/orders/:id',
    component: OrderTrackingComponent,
  },
  {
    path: 'journal',
    component: JournalComponent,
  },
  {
    path: 'article/:id',
    component: ArticleComponent,
  },
  {
    path: 'signup',
    component: LoginComponent,
  },
   {
    path: 'verifyEmail',
    component: LoginComponent,
  },
  {
    path: 'password-reset',
    component: PasswordresetComponent,
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'mixmatch',
    component: MixmatchComponent,
  },
  {
    path: 'generatereport',
    component: ReportComponent,
  },
  {
    path: '',
    component: LandingpageComponent,
    pathMatch: 'full'
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
 
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
