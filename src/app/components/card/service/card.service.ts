import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private http: HttpClient) { }

  apiTodo = AppConfig.apiUrl + '/api/todos/';
  apiTasks = AppConfig.apiUrl + '/api/tasks/';

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

}
