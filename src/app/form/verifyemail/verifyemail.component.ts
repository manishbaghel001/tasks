import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent {
  email: string | null = null;
  forgotPassLabel: boolean = false
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.email = user['email'];
      } else {
        this.email = this.authService.email
        this.forgotPassLabel = true
      }
    })
  }
}
