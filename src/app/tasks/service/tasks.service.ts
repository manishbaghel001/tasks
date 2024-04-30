import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/config';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient
  ) { }

  apiMode = AppConfig.apiUrl + '/api/mode/';
  apiTasks = AppConfig.apiUrl + '/api/tasks/';
  apiTodo = AppConfig.apiUrl + '/api/todos/';
  apiImage = AppConfig.apiUrl + '/api/image/';

  //Mode APIs

  updateMode(body, uid): Observable<any> {
    return this.http.patch(this.apiMode + uid, body)
  }

  // Todo APIs

  createTodo(uid: string, updatedData: object) {
    return this.http.post(this.apiTodo + uid, updatedData)
  }

  patchTodo(uid: String, body) {
    return this.http.patch(this.apiTodo + uid, body)
  }

  // Tasks APIs

  getTasks(uid) {
    return this.http.get(this.apiTasks + uid)
  }

  createTasks(body: object, uid) {
    return this.http.post(this.apiTasks + uid, body)
  }

  patchTasks(uid: string, body: any) {
    return this.http.patch(this.apiTasks + uid, body)
  }


  // Image APIs
  getImage(uid: string): Observable<any> {
    return this.http.get(this.apiImage + uid, { responseType: 'arraybuffer' });
  }

  uploadImage(file: File, uid: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(this.apiImage + uid, formData);
  }

}

