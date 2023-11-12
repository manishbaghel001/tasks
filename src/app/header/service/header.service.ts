import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient) { }

  apiMode = AppConfig.apiUrl + '/api/mode/654ba643603ca47cd68ea489'
  apiTasks = AppConfig.apiUrl + '/api/tasks'

  getMode() {
    return this.http.get(this.apiMode)
  }

  updateMode(mode: String) {
    return this.http.patch(this.apiMode, { mode: mode })
  }

  getTasks() {
    return this.http.get(this.apiTasks)
  }
}
