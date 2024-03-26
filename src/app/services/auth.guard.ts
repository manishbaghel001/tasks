import { Injectable } from '@angular/core';
import {
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CacheService } from '../cache/cache.service';
@Injectable({
    providedIn: 'root',
})

export class AuthGuard {

    constructor(private cacheService: CacheService, private router: Router) { }


    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.userData()) {
            return this.userData()
        }
        else {
            this.userData();
            this.router.navigate(['/login']);
            return false
        }
    }

    userData(): boolean | any {
        let user = this.cacheService.getData('token')

        if (user && (user['emailVerified'] || (user['phoneNumber'] != '' && user['phoneNumber'] != null))) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}
