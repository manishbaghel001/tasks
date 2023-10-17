import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/config';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient) { }
  api = AppConfig.apiUrl

  getJson() {
    return this.http.get(this.api + "/api/todo")
  }

  getJsonById(id: number) {
    return this.http.get(this.api + "/api/todo/" + id)
  }

  postJson(updatedData: any) {
    return this.http.post(this.api + "/api/todo", updatedData)
  }

  patchJson(id: number, updatedData: any) {
    return this.http.patch(this.api + "/api/todo/" + id, updatedData)
  }

  deleteJson(id: number) {
    return this.http.delete(this.api + "/api/todo/" + id)
  }
}
