import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private fireAuth: AuthService, private router: Router) { }
  email: string = '';
  password: string = '';
  passwordToggle: boolean = false

  ngOnInit() {

  }

  login() {
    if (this.email == '' || this.password == '') {
      alert('Please enter your email and password')
    }
    else {
      this.fireAuth.signIn(this.email, this.password);
      this.email = '';
      this.password = ''
    }
  }

  forgotPass() {
    this.router.navigate(['/forgot-password'])
  }

  register() {
    this.router.navigate(['/register'])
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
    this.fireAuth.singInWithGoogle()
  }

  signInWithGithub() {
    this.fireAuth.singInWithGithub()
  }

}
