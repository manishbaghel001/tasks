import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, User } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CacheService } from '../cache/cache.service';
@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private userSubject = new BehaviorSubject<User | null>(null);
    user = this.userSubject.asObservable();
    email: any

    constructor(private afAuth: AngularFireAuth, private cacheService: CacheService, private router: Router, private firestore: AngularFirestore) {
        this.afAuth.authState.subscribe(user => {
            this.userSubject.next(user);
        });
    }

    getUser(): Observable<any> {
        return this.user;
    }

    setDisplayName(firstName: string, lastName: string) {
        const displayName = `${firstName} ${lastName}`;
        return this.afAuth.currentUser.then((user) => {
            return user?.updateProfile({ displayName });
        });
    }

    signIn(email: string, password: string, rememberMe: any) {
        this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
            if (res.user?.emailVerified) {
                if (rememberMe != '') {
                    this.cacheService.setData('token', res.user)
                }
                this.router.navigate(['/tasks'])
            }
            else {
                if (res.user) {
                    res.user.sendEmailVerification();
                    this.router.navigate(['/verify-email'])
                }
            }
        }, err => {
            alert(err.message);
            this.router.navigate(['/login'])
        });
    }

    register(form: object) {
        this.afAuth.createUserWithEmailAndPassword(form['email'], form['password']).then((res) => {

            res.user?.updateProfile({
                displayName: form['userName']
            })
            this.storeAdditionalUserData(res.user?.uid, {
                fullName: form['fullName'],
                username: form['userName'],
            });

            if (res.user) {
                res.user.sendEmailVerification();
                this.router.navigate(['/verify-email'])
            }
        }, err => {
            alert(err.message);
        });
    }

    private storeAdditionalUserData(uid: string | undefined, data: any): void {
        if (uid) {
            this.firestore.collection('users').doc(uid).set(data, { merge: true })
                .then(() => {
                    console.log('Additional user data stored successfully');
                })
                .catch(error => {
                    console.error('Error storing additional user data:', error);
                });
        }
    }

    signOut() {
        this.afAuth.signOut().then(() => {
            this.cacheService.removeData('token')
            this.router.navigate(['/login'])
        }, err => {
            alert(err.message);
        });
    }

    forgotPassword(email: string) {
        this.afAuth.sendPasswordResetEmail(email).then(() => {
            this.email = email;
            this.router.navigate(['/verify-email'])
        }, err => {
            alert(err.message);
        });
    }

    deleteCurrentUser() {
        this.afAuth.currentUser.then((user) => {
            if (user) {
                user.delete();
                this.cacheService.removeData('token')
                this.router.navigate(['/login'])
            }
        }, err => {
            alert(err.message);
        });
    }

    // Sing with google
    singInWithGoogle() {
        return this.afAuth.signInWithPopup(new GoogleAuthProvider()).then((res) => {
            const user = res.user;
            if (user) {
                const [firstName, lastName] = user.displayName?.split(' ') || ['', ''];
                user.updateProfile({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }).then(() => {
                    this.cacheService.setData('token', res.user)
                    this.router.navigate(['/tasks'])
                });
            }
        }, err => {
            alert(err.message);
            this.router.navigate(['/login'])
        })
    }

    // Sing with github
    singInWithGithub() {
        return this.afAuth.signInWithPopup(new GithubAuthProvider()).then((res) => {
            const user = res.user;
            if (user) {
                const [firstName, lastName] = user.displayName?.split(' ') || ['', ''];
                user.updateProfile({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }).then(() => {
                    this.cacheService.setData('token', res.user)
                    this.router.navigate(['/tasks'])
                });
            }
        }, err => {
            alert(err.message);
            this.router.navigate(['/login'])
        })
    }
}
