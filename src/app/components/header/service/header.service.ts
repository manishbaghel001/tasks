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

  apiMode = AppConfig.apiUrl + '/api/mode'
  apiTasks = AppConfig.apiUrl + '/api/tasks'

  getMode(): Observable<any> {
    const cacheKey = 'modeKey';

    const cachedData = this.cacheService.getData(cacheKey);
    if (cachedData) {
      return of(cachedData)
    } else {

      const data = this.http.get(this.apiMode).pipe(
        map(res => res[0]['mode'])
      );
      return data;
    }
  }

  updateMode(mode: String): Observable<any> {
    return this.http.patch(this.apiMode, { mode: mode })
  }

  getTasks(): Observable<any> {
    return this.http.get(this.apiTasks)
  }
}
