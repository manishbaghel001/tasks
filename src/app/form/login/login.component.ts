import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {
    this.rememberMeLogin = history.state?.['rememberMe'];
  }

  rememberMe: string[] = [];
  rememberMeLogin: any;
  @ViewChild('loginForm') loginForm!: NgForm;
  passwordToggle: boolean = false
  phoneNumber: any;
  displayPhoneModal: string = 'none'

  async ngOnInit() {
    await this.authService.getUserdata().then((user) => {
      if (this.rememberMeLogin != 'false') {
        if (user && (user['emailVerified'] || (user['phoneNumber'] != '' && user['phoneNumber'] != null))) {
          this.router.navigate(['/tasks']);
        }
        else {
          this.router.navigate(['/login']);
        }
      }
      else {
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
      let check = this.rememberMe.length != 0 ? this.rememberMe[0].toString() : "false";
      this.authService.signIn(item['email'], item['password'], check);
    }
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
