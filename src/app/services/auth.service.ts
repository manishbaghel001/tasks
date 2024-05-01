import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GithubAuthProvider, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CacheService } from '../cache/cache.service';
import firebase from 'firebase/compat/app'
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})

export class AuthService {

    private userSubject = new BehaviorSubject<User | null>(null);
    user = this.userSubject.asObservable();
    email: any;
    @Output() valueEmitter = new EventEmitter<string>();
    private inputValueSubject = new BehaviorSubject<boolean>(false);
    constructor(private afAuth: AngularFireAuth, private cacheService: CacheService, private router: Router, private firestore: AngularFirestore) {
        this.afAuth.authState.subscribe(user => {
            this.userSubject.next(user);
        });
    }

    setLoaderValue(value: boolean) {
        this.inputValueSubject.next(value);
    }

    isUserLoggedIn(): boolean {
        return !!this.user; // Return true if user is not null or undefined
    }

    getUser(): Observable<any> {
        return this.user;
    }

    getLoaderValue() {
        return this.inputValueSubject.asObservable();
    }

    sendVerificationCode(phoneNumber: string, appVerifier) {
        this.setLoaderValue(true);
        return this.afAuth.signInWithPhoneNumber(phoneNumber, appVerifier).then((res) => {
            this.setLoaderValue(false);
            return res['verificationId']
        }, err => {
            alert(err.message);
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        })
    }

    verifyCode(verificationId: string, code: string) {
        this.setLoaderValue(true);
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
        return this.afAuth.signInWithCredential(credential).then((res) => {
            if (res.user['displayName'] != null) {
                this.cacheService.setData('token', res.user)
                this.router.navigate(['/tasks'])
                this.setLoaderValue(false);
                return res.user
            }
            else {
                this.setLoaderValue(false);
                return res.user
            }
        }, err => {
            alert(err.message);
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        });
    }

    updateInfo(user, userName, fullName) {
        user?.updateProfile({
            displayName: userName
        })
        user = user['multiFactor']['user'];

        this.storeAdditionalUserData(user?.uid, {
            fullName: fullName,
            username: userName
        })
        user = { ...user, displayName: userName };
        this.cacheService.setData('token', user)
        this.router.navigate(['/tasks'])
    }

    setDisplayName(firstName: string, lastName: string) {
        this.setLoaderValue(true);
        const displayName = `${firstName} ${lastName}`;
        return this.afAuth.currentUser.then((user) => {
            this.setLoaderValue(false);
            return user?.updateProfile({ displayName });
        });
    }

    signIn(email: string, password: string, rememberMe: any) {
        this.setLoaderValue(true);
        this.afAuth.signInWithEmailAndPassword(email, password).then((res) => {
            if (res.user?.emailVerified) {
                this.setLoaderValue(false);
                this.cacheService.setData('token', res.user)
                this.router.navigate(['/tasks'], { state: { rememberMe: rememberMe } })
            }
            else {
                if (res.user) {
                    this.setLoaderValue(false);
                    res.user.sendEmailVerification();
                    this.router.navigate(['/verify-email'])
                }
            }
        }, err => {
            alert(err.message);
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        });
    }

    register(form: object) {
        this.setLoaderValue(true);
        this.afAuth.createUserWithEmailAndPassword(form['email'], form['password']).then((res) => {

            res.user?.updateProfile({
                displayName: form['userName']
            })
            this.storeAdditionalUserData(res.user?.uid, {
                fullName: form['fullName'],
                username: form['userName'],
            });

            if (res.user) {
                this.setLoaderValue(false);
                res.user.sendEmailVerification();
                this.router.navigate(['/verify-email'])
            }
        }, err => {
            this.setLoaderValue(false);
            alert(err.message);
        });
    }

    private storeAdditionalUserData(uid: string | undefined, data: any): void {
        if (uid) {
            this.firestore.collection('users').doc(uid).set(data, { merge: true })
        }
    }

    signOut() {
        this.setLoaderValue(true);
        this.afAuth.signOut().then(() => {
            this.setLoaderValue(false);
            this.cacheService.removeData('token')
            this.cacheService.removeData('rememberMe')
            this.router.navigate(['/login'])
        }, err => {
            this.setLoaderValue(false);
            alert(err.message);
        });
    }

    forgotPassword(email: string) {
        this.setLoaderValue(true);
        this.afAuth.sendPasswordResetEmail(email).then(() => {
            this.setLoaderValue(false);
            this.email = email;
            this.router.navigate(['/verify-email'])
        }, err => {
            this.setLoaderValue(false);
            alert(err.message);
        });
    }

    deleteCurrentUser() {
        this.setLoaderValue(true);
        this.afAuth.currentUser.then((user) => {
            if (user) {
                user.delete();
                this.setLoaderValue(false);
                this.cacheService.removeData('token')
                this.router.navigate(['/login'])
            }
        }, err => {
            this.setLoaderValue(false);
            alert(err.message);
        });
    }

    getUserdata(): Promise<any> {
        this.setLoaderValue(true);
        return new Promise<any>((resolve, reject) => {
            this.afAuth.authState.subscribe(user => {
                if (user) {
                    user.updateProfile({
                        displayName: user.displayName,
                    }).then(() => {
                        this.setLoaderValue(false);
                        resolve(user);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    this.setLoaderValue(false);
                    this.router.navigate(['/login']);
                    resolve(null);
                }
            });
        });
    }

    // Sign with google
    signInWithGoogle() {
        this.setLoaderValue(true);
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        this.afAuth.signInWithRedirect(provider)
            .then(() => {

            }, err => {
                alert(err.message);
                this.setLoaderValue(false);
                this.router.navigate(['/login'])
            })
    }

    // Sign with github
    signInWithGithub() {
        this.setLoaderValue(true);
        return this.afAuth.signInWithPopup(new GithubAuthProvider()).then((res) => {
            const user = res.user;
            if (user) {
                user.updateProfile({
                    displayName: user.displayName,
                }).then(() => {
                    this.setLoaderValue(false);
                    this.cacheService.setData('token', res.user)
                    this.router.navigate(['/tasks'])
                });
            }
        }, err => {
            alert(err.message);
            this.setLoaderValue(false);
            this.router.navigate(['/login'])
        })
    }
}
