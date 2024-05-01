import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CacheService } from 'src/app/cache/cache.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private cacheService: CacheService, private router: Router) {
  }

  rememberMe: string[] = [];
  @ViewChild('loginForm') loginForm!: NgForm;
  passwordToggle: boolean = false
  phoneNumber: any;
  displayPhoneModal: string = 'none'

  async ngOnInit() {
    await this.authService.getUserdata().then((user) => {
      let remember = this.cacheService.getData('rememberMe');
      if (user) {
        this.cacheService.setData('token', user)
        this.router.navigate(['/tasks']);
      }
      else if (remember != null && remember == false) {
        this.cacheService.removeData('rememberMe');
        this.cacheService.removeData('token');
        this.router.navigate(['/login']);
      }
    })
  }

  openModal() {
    this.displayPhoneModal = 'flex'
  }
  closeModal() {
    this.displayPhoneModal = 'none'
  }
  login(item: any) {
    if (!this.loginForm.valid) {
      alert('Please enter your email and password')
    }
    else {
      let check = this.rememberMe.length != 0 ? this.rememberMe[0] : false;
      this.cacheService.setData('rememberMe', this.rememberMe.length != 0 ? this.rememberMe[0] : false)
      this.authService.signIn(item['email'], item['password'], check);
    }
  }

  rememberMeBtn(remember) {
    this.cacheService.setData('rememberMe', remember[0] ? remember[0] : false)
  }

  forgotPass() {
    this.router.navigate(['/forgot-password'])
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    if (passwordInput['type'] === "password") {
      passwordInput['type'] = "text";
      this.passwordToggle = false;
    } else {
      passwordInput['type'] = "password";
      this.passwordToggle = true;
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
  }

  signInWithGithub() {
    this.authService.signInWithGithub()
  }

}
