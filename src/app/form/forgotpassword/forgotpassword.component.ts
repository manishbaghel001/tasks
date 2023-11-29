import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  constructor(private authService: AuthService, private router: Router) { }
  email: string = '';

  loginPage() {
    this.router.navigate(['/form'])
  }

  forgotPasswordMail() {
    this.authService.forgotPassword(this.email)
  }

}
