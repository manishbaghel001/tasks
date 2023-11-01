import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient) { }

  api = AppConfig.apiUrl;
  apiMode = '/api/mode/'

  getJson() {
    return this.http.get(this.api + this.apiMode)
  }

  updateMode(mode: String) {
    return this.http.patch(this.api + this.apiMode + mode, {})
  }
}
