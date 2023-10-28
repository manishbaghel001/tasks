import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private http: HttpClient) { }
  // api = AppConfig.devUrl;
  api = AppConfig.apiUrl;

  apiTodo = '/api/todos/';
  apiCreate = '/api/create/';
  apiCompleted = '/api/complete/';
  apiMode = '/api/mode/'

  getJson() {
    return this.http.get(this.api + this.apiTodo)
  }

  getJsonById(taskId: String, id: number) {
    return this.http.get(this.api + this.apiTodo + taskId + '/' + id)
  }

  postJson(tasksId: string, updatedData: object) {
    return this.http.post(this.api + this.apiTodo + tasksId, updatedData)
  }

  patchJson(taskId: String, id: number, updatedData: any) {
    return this.http.patch(this.api + this.apiTodo + taskId + '/' + id, updatedData)
  }

  deleteJson(taskId: String, id: number) {
    return this.http.delete(this.api + this.apiTodo + taskId + '/' + id)
  }

  deleteCompletedTask(taskId: String, id: number) {
    return this.http.delete(this.api + this.apiCompleted + taskId + '/' + id)
  }

  completedTask(taskId: string, id: number) {
    return this.http.get(this.api + this.apiCompleted + taskId + '/' + id)
  }

  updateMode(mode: String) {
    return this.http.patch(this.api + this.apiMode + mode, {})
  }

  createTodo(body: object, taskId: string) {
    return this.http.post(this.api + this.apiCreate + taskId, body)
  }

}
