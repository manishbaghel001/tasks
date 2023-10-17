import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient) { }

  getJson() {
    return this.http.get("http://localhost:3000/todo")
  }

  postJson(updatedData: any) {
    return this.http.post("http://localhost:3000/update-json", updatedData)
  }
}
