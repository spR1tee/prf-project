import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://172.100.0.10:5000/login', body, {headers: headers, withCredentials: true});
  }

  register(user: User) {
    // HTTP POST request
    const body = new URLSearchParams();
    body.set('email', user.email);
    body.set('password', user.password);

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://172.100.0.10:5000/register', body, {headers: headers});
  }

  logout() {
    return this.http.post('http://172.100.0.10:5000/logout', {}, {withCredentials: true, responseType: 'text'});
  }

  checkAuth() {
    return this.http.get<boolean>('http://172.100.0.10:5000/checkAuth', {withCredentials: true});
  }

  getUser() {
    return this.http.get('http://172.100.0.10:5000/getUser', {withCredentials: true});
  }

  getUserById(id: string) {
    return this.http.get('http://172.100.0.10:5000/getUserById?id=' + id, {withCredentials: true});
  }
}
