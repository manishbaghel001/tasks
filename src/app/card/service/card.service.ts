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
  apiTodoComplete = AppConfig.apiUrl + '/api/todos/complete/';
  apiTasks = AppConfig.apiUrl + '/api/tasks/';
  apiTodoBatch = AppConfig.apiUrl + '/api/todos/batch/';

  // Todo APIs
  getTodos() {
    return this.http.get(this.apiTodo)
  }

  getJsonById(taskId: String, id: number) {
    return this.http.get(this.apiTodo + taskId + '/' + id)
  }

  createTodo(tasksId: string, updatedData: object) {
    return this.http.post(this.apiTodo + '/batch/' + tasksId, updatedData)
  }

  patchJson(taskId: String, id: number, updatedData: any) {
    return this.http.patch(this.apiTodo + taskId + '/' + id, updatedData)
  }

  deleteTodo(taskId: String) {
    return this.http.delete(this.apiTodo + taskId)
  }

  completeTodo(taskId: String) {
    return this.http.get(this.apiTodoComplete + taskId)
  }

  // Tasks APIs
  getTasks() {
    return this.http.get(this.apiTasks)
  }

  createTasks(body: object) {
    return this.http.post(this.apiTasks, body)
  }

  getTasksById(id: string) {
    return this.http.get(this.apiTasks + id)
  }

  patchTasks(id: string, body: any) {
    return this.http.patch(this.apiTasks + id, body)
  }

  deleteTasks(id: string) {
    return this.http.delete(this.apiTasks + id)
  }

  deleteTodosBatch(id: string) {
    return this.http.patch(this.apiTodoBatch + id, {})
  }
}
