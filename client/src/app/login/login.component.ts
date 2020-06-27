import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  button_status = '';
  errorMsg: string;

  constructor(private authenticationService: UserService) { }

  ngOnInit(): void {
  }

  login(loginForm: NgForm){
    this.errorMsg = '';
    this.button_status="submit";
    console.log(this.email);
    console.log(this.password);
    if(this.email && this.password) {
      this.authenticationService.login({email : this.email, password : this.password})
        .subscribe(
          user => {
            if(user) {
              console.log(user);
              window.location.href = '/home';
            }
          },
          error => {
            this.errorMsg = error.error['message'];
            console.log(error.error);
          });
    }
  }

}
