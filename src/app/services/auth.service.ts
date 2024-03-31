import { EventEmitter, Injectable, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, User } from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CacheService } from '../cache/cache.service';
import firebase from '@firebase/app-compat'

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

    getLoaderValue() {
        return this.inputValueSubject.asObservable();
    }

    sendVerificationCode(phoneNumber: string) {
        this.setLoaderValue(true);
        const formattedPhoneNumber = phoneNumber;
        const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
        return this.afAuth.signInWithPhoneNumber(formattedPhoneNumber, appVerifier).then((res) => {
            this.setLoaderValue(false);
            return res['verificationId']
        }, err => {
            alert(err.message);
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

    getUser(): Observable<any> {
        return this.user;
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
            this.router.navigate(['/login'])
        }, err => {
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
            alert(err.message);
        });
    }

    // Sing with google
    singInWithGoogle() {
        this.setLoaderValue(true);
        return this.afAuth.signInWithPopup(new GoogleAuthProvider()).then((res) => {
            const user = res.user;
            if (user) {
                const [firstName, lastName] = user.displayName?.split(' ') || ['', ''];
                user.updateProfile({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }).then(() => {
                    this.setLoaderValue(false);
                    this.cacheService.setData('token', res.user)
                    this.router.navigate(['/tasks'])
                    if (this.router.url == '/tasks') {
                        window.location.reload();
                    }
                });
            }
        }, err => {
            alert(err.message);
            this.router.navigate(['/login'])
        })
    }

    // Sing with github
    singInWithGithub() {
        this.setLoaderValue(true);
        return this.afAuth.signInWithPopup(new GithubAuthProvider()).then((res) => {
            const user = res.user;
            if (user) {
                const [firstName, lastName] = user.displayName?.split(' ') || ['', ''];
                user.updateProfile({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }).then(() => {
                    this.setLoaderValue(false);
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
