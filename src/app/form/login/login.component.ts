import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }
  passwordToggle: boolean = false

  ngOnInit() {

  }

  login(item: any) {
    if (item['email'] == '' || item['password'] == '') {
      alert('Please enter your email and password')
    }
    else {
      this.authService.signIn(item['email'], item['password'], item['rememberMe']);
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
    this.authService.singInWithGoogle()
  }

  signInWithGithub() {
    this.authService.singInWithGithub()
  }

}
