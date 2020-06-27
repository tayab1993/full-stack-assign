import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { LoginResolver } from './is-loggedin.resolver';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path : 'home', component: HomeComponent},
  { path : 'login', component: LoginComponent, resolve: { LoginResolver }},
  { path : 'signup', component: SignupComponent, resolve: { LoginResolver }},
  { path : 'addCoupon', component: AddCouponComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
