import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})

export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {

        const user = this.authService.user
        if (this.authService.isLoggedIn() || localStorage.getItem('rememberMe') == 'false') {
            localStorage.removeItem('rememberMe')
            return true;
        } else {
            this.router.navigate(['/form']);
            return false;
        }
    }
}