import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/config';
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient) { }
  api = AppConfig.apiUrl;
  apiMytasks = '/api/mytasks/';

  getJson() {
    return this.http.get(this.api + this.apiMytasks)
  }

  getJsonById(id: number) {
    return this.http.get(this.api + this.apiMytasks + id)
  }

  postJson(updatedData: any) {
    return this.http.post(this.api + this.apiMytasks, updatedData)
  }

  patchJson(id: number, updatedData: any) {
    return this.http.patch(this.api + this.apiMytasks + id, updatedData)
  }

  deleteJson(id: number) {
    return this.http.delete(this.api + this.apiMytasks + id)
  }
}
