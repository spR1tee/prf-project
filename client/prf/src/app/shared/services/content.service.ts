import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Content } from '../model/content';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  constructor(private http: HttpClient) { }

  create(content: Content) {
    const body = new URLSearchParams();
    body.set('owner', content.owner);
    body.set('title', content.title);
    body.set('content', content.content);
    body.set('editors', content.editors);
    body.set('viewers', content.viewers);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post('http://localhost:5000/saveNewContent', body, {headers: headers});
  }


  getAll() {
    return this.http.get<Content[]>('http://localhost:5000/getAllContent', {withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete('http://localhost:5000/deleteContent?id=' + id, {withCredentials: true});
  }
}
