
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CacheService {

    setData(key: string, value: any): void {
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    getData(key: string): any {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

}