import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const URL = 'http://localhost:4500/';

@Injectable()
export class UserService {

  currentUser: any;
  token;
  constructor(private http: HttpClient)
  {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.token = this.currentUser.jwt_token;
    }
  }

  login(data : any) {
    return this.http.post(URL+'api/auth/login', data)
      .pipe(map(user => {
        if (user){
          localStorage.setItem('currentUser', JSON.stringify(user['data']));
          return user['data'];
        }
        else {
          return user;
        }
      }), catchError((error: any) =>
      {
        if (error) return throwError(error);
      }));
  }

  signup(data : any) {
    return this.http.post(URL+'api/auth/signup', data)
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user['data']));
          return user;
        }
        else {
          return user;
        }
      }), catchError((error: any) =>
      {
        if (error) return throwError(error);
      }));
  }

  getAllCoupons() {
    return this.http.get(URL+'api/coupons/getAllCoupons', {
      headers: new HttpHeaders().set('x-access-token', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) {
        return res;
      }
    }), catchError((error: any) =>
    {
      console.log(error);
      if (error) {
        //
        return throwError(error);
      }
    }));
  }

  deleteCoupon(id: string) {
    return this.http.post(URL+'api/coupons/deleteCoupon', { coupon_id: id}, {
      headers: new HttpHeaders().set('x-access-token', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) {
        console.log(res);
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error) {
        console.log(error);
        return throwError(error);
      }

    }));
  }

  createCoupon(data: any) {
    return this.http.post(URL+'api/coupons/createCoupon', data, {
      headers: new HttpHeaders().set('x-access-token', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) {
        console.log(res);
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error) {
        console.log(error);
        return throwError(error);
      }

    }));
  }

  logout() {
    return this.http.get(URL+'api/auth/logout' , {
      headers: new HttpHeaders().set('x-access-token', this.token)
    }).pipe(map((res: Response) =>
    {
      if (res) {
        localStorage.removeItem('currentUser');
        return res;
      }
    }), catchError((error: any) =>
    {
      if (error) {
        return throwError(error);
      }

    }));
  }

}
