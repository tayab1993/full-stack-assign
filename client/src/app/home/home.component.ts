import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  couponsData;
  currentUser: any = {};

  constructor(private http: HttpClient , private authenticationService: UserService, private route: ActivatedRoute,
    private router: Router) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.currentUser) this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.getAllCoupons();
  }

  getAllCoupons() {
    this.authenticationService.getAllCoupons()
    .subscribe(
      data => {
        this.couponsData = data['data']['data'];
        console.log(this.couponsData);
      },
      error => {
        console.log('erorr man');
      });
  }

  delete(id: string) {
    console.log(id);
    this.authenticationService.deleteCoupon(id)
    .subscribe(
      data => {
        console.log(data);
        this.getAllCoupons();
      },
      error => {
        console.log('erorr man');
      });
  }

  gotoAdd(){
    this.router.navigate(['/addCoupon']);
  }

  logout(){
    this.authenticationService.logout()
    .subscribe(
      data => {
        console.log(data);
        window.location.href = '/login';
      },
      error => {
        console.log('erorr man');
      });
  }

}
