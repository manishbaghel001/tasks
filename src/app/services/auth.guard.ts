import { Injectable } from '@angular/core';
import {
    Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})

export class AuthGuard {

    constructor(private authService: AuthService, private router: Router) { }


    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return this.userData()
    }

    userData(): boolean | any {
        this.authService.getUser().subscribe((user) => {
            console.log(user, "klklkl");

            if (user && user['emailVerified']) {
                if (this.authService.isLoggedIn() || localStorage.getItem('rememberMe') == 'false') {
                    localStorage.removeItem('rememberMe')
                    return true;
                } else {
                    this.router.navigate(['/login']);
                    return false;
                }
            }
            else {
                return false
            }
        })
    }
}
