import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  alreadyHaveAccount() {
    this.router.navigate(['/form'])
  }
}
