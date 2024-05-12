import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private sharedString = new BehaviorSubject<string>('');
  email_string!: string;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post('http://localhost:5000/login', body, {headers: headers, withCredentials: true});
  }

  getString() {
    return this.sharedString.asObservable();
  }

  updateString(newString: string) {
    this.sharedString.next(newString);
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://localhost:5000/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://localhost:5000/checkAuth', {withCredentials: true});
  }
}
