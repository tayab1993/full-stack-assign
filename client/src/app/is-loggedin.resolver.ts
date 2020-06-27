import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LoginResolver  {
  currentUser;
  constructor( private http: HttpClient, private router: Router) {}

  resolve() : void {
     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
     if (this.currentUser) this.router.navigate(['/home']);
  }
}
