import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.css']
})
export class AddCouponComponent implements OnInit {
  currentUser: any = {};
  percent_off: number;
  duration: string; //once, repeating, forever
  duration_in_months: number //if duration is repeating or forever
  couponName: string;
  percent_offErrors: string;
  durationErrors: string;
  durationLog: string;
  couponNameErrors: string;
  log: string;

  constructor(private http: HttpClient , private authenticationService: UserService, private route: ActivatedRoute,
    private router: Router) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.currentUser) this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }

  addCoupon(couponForm: NgForm){
    console.log('in here');
    let errorCount = 0;
    this.couponNameErrors = '';
    this.percent_offErrors = '';
    this.durationErrors = '';
    this.durationLog = '';

    if(!this.couponName) {
      errorCount = 1;
      this.couponNameErrors = 'Please enter coupon name';
    }
    if(!this.percent_off) {
      errorCount = 1;
      this.percent_offErrors = 'Please enter percent off';
    }
    if(!this.duration) {
      errorCount = 1;
      this.durationErrors = 'Please enter once, forver or repeating here';
    }
    if((this.duration === 'forever' || this.duration === 'repeating') && !this.duration_in_months) {
      errorCount = 1;
      this.durationLog = 'Please enter duration in months';
    }
    if(this.duration_in_months && isNaN(this.duration_in_months)) {
      errorCount = 1;
      this.durationLog = 'Only numbers are allowed';
    }
    if(this.percent_off && isNaN(this.percent_off)) {
      errorCount = 1;
      this.percent_offErrors = 'Only numbers are allowed';
    }
    if(this.percent_off && !isNaN(this.percent_off)) {
      if(this.percent_off > 0 && this.percent_off < 101) {}
      else {
        errorCount = 1;
        this.percent_offErrors = 'Please enter number between 1 & 100';
      }
    }

    if(errorCount === 0) {
      this.authenticationService.createCoupon(couponForm.form.value)
        .subscribe(
          data => {
            window.location.href = '/home';
          },
          error =>
          {
            this.log = 'Something went wrong';
          });
    }
  }

}
