import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstNameErrors: string;
  lastNameErrors: string;
  passwordErrors: string;
  passwordLog: string;
  errorMsg: string;
  emailLog: string;
  firstNameLog: string;
  lastNameLog: string;
  log: string;
  button_status = '';

  constructor(private authenticationService: UserService, private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  }

  signup(signForm: NgForm){
    this.passwordErrors = '';
    this.emailLog = '';
    this.firstNameLog = '';
    this.lastNameLog = '';
    this.passwordLog = '';
    this.log = '';

    let errorCount = 0;
    if(this.password != this.confirmPassword ) {
      errorCount = 1;
      this.confirmPassword = '';
      this.passwordErrors = "Passwords do not match";
    }

    if(!this.email) {
      errorCount = 1;
      this.emailLog = 'Please enter email address';
    }

    if(!this.firstName) {
      errorCount = 1;
      this.firstNameLog = 'Please enter first name';
    }

    if(!this.lastName) {
      errorCount = 1;
      this.lastNameLog = 'Please enter last name';
    }

    if(!this.password) {
      errorCount = 1;
      this.passwordLog = 'Please enter password';
    }

    if(errorCount === 0) {
      this.authenticationService.signup(signForm.form.value)
        .subscribe(
          data => {
            window.location.href = '/home';
          },
          error =>
          {
            this.emailLog = error.error['message'];
            this.log = 'Something went wrong';
          });
    }
  }

}
