import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }
  @ViewChild('registerationForm') registerationForm!: NgForm;

  passwordToggle: boolean = false
  confirmPasswordToggle: boolean = false

  ngOnInit() { }

  register() {
    if (!this.registerationForm.valid) {
      alert('Please enter your registration details')
    }
    else if (this.registerationForm.valid && this.registerationForm.value['password'] != this.registerationForm.value['confirmPassword']) {
      alert('Password and Confirm password does not matching')
    }
    else if (this.registerationForm.valid && this.registerationForm.value['password'] == this.registerationForm.value['confirmPassword']) {
      this.authService.register(this.registerationForm.value);
    }
  }

  alreadyHaveAccount() {
    this.router.navigate(['/login'])
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

  toggleConfirmPasswordVisibility() {
    const passwordInput = document.getElementById("confirmPassword");
    if (passwordInput['type'] === "password") {
      passwordInput['type'] = "text";
      this.confirmPasswordToggle = false;
    } else {
      passwordInput['type'] = "password";
      this.confirmPasswordToggle = true;
    }
  }
}
