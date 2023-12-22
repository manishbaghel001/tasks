import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheService } from 'src/app/cache/cache.service';
import { AppConfig } from 'src/app/config';
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  apiMode = AppConfig.apiUrl + '/api/mode/'
  apiTasks = AppConfig.apiUrl + '/api/tasks/'

  getMode(uid): Observable<any> {
    const cacheKey = 'modeKey';

    const cachedData = this.cacheService.getData(cacheKey);
    if (cachedData) {
      return of(cachedData)
    } else {
      return this.http.get(this.apiMode + uid).pipe(
        map((res) => {
          this.cacheService.setData(cacheKey, res);
          return res;
        }));
    }
  }

  getUIDData(uid): Observable<any> {
    const cacheKey = 'UIDDataKey';

    const cachedData = this.cacheService.getData(cacheKey);
    if (cachedData) {
      return of(cachedData)
    } else {
      return this.http.get(this.apiTasks + uid).pipe(
        map((res) => {
          this.cacheService.setData(cacheKey, res);
          return res;
        }))
    }
  }

  updateMode(mode: String, uid): Observable<any> {
    return this.http.patch(this.apiMode + uid, { mode: mode })
  }

}
