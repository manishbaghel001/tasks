import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() { }

  register(item: any) {
    console.log(item, "kjlklklkl");

    if (item['email'] == '' || item['password'] == '') {
      alert('Please enter ypur email and password')
    }
    else {
      this.auth.register(item);
    }
  }

  alreadyHaveAccount() {
    this.router.navigate(['/login'])
  }
}
