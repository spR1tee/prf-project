import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Content } from '../model/content';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private dataSource = new BehaviorSubject<any>(null);
  currentData = this.dataSource.asObservable();

  constructor(private http: HttpClient) { }

  changeData(data: any) {
    this.dataSource.next(data);
  }

  create(content: Content, owner: string) {
    const body = new URLSearchParams();
    body.set('owner', owner);
    body.set('title', content.title);
    body.set('content', content.content);
    body.set('editors', content.editors);
    body.set('viewers', content.viewers);

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/saveNewContent', body, {headers: headers});
  }

  update(content: Content, owner: string, id: string) {
    const body = new URLSearchParams();
    body.set('owner', owner);
    body.set('title', content.title);
    body.set('content', content.content);
    body.set('editors', content.editors);
    body.set('viewers', content.viewers);

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/saveNewContent?id=' + id, body, {headers: headers});
  }


  getAll() {
    return this.http.get<Content[]>('http://localhost:5000/getAllContent', {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:5000/deleteContent?id=' + id, {withCredentials: true});
  }

  getOwnedContent(id: string) {
    return this.http.get('http://localhost:5000/getOwnedContent?id=' + id, {withCredentials: true});
  }

  getEditContent(id: string) {
    return this.http.get('http://localhost:5000/getEditContent?id=' + id, {withCredentials: true});
  }

  getViewContent(id: string) {
    return this.http.get('http://localhost:5000/getViewContent?id=' + id, {withCredentials: true});
  }
}
