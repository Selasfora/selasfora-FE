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
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ReportComponent } from './report/report.component';

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
    path: 'journal',
    component: JournalComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'reset-password',
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
    path: 'generatereport',
    component: ReportComponent,
  },
  {
    path: '',
    component: LandingpageComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
