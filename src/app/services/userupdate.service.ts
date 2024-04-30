import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserUpdateService {

    private userUpdatedSource = new Subject<void>();

    userUpdated$ = this.userUpdatedSource.asObservable();

    notifyUserUpdated() {
        this.userUpdatedSource.next();
    }
}
