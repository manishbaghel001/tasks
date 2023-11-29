import { Component, OnInit } from '@angular/core';
import { HeaderService } from './service/header.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { CacheService } from 'src/app/cache/cache.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private cacheService: CacheService,
    private authService: AuthService,
  ) { }

  forkSub: Subscription;
  mode: boolean = false;
  tasks: any;
  menuOpen: boolean = false;
  errorMsg = "API failing"
  showProfileOptions: boolean = false;
  email: string;
  password: string;
  userData: object;
  photoURL: string;
  // profile_face: boolean = true

  ngOnInit() {
    this.forkSub = forkJoin({
      mode: this.headerService.getMode().pipe(
        catchError((err) => of(
          alert('API Failing')
        ))),
      tasks: this.headerService.getTasks().pipe(
        catchError((err) => of(
          alert('API Failing')
        )))
    }).subscribe({
      next: ({ mode, tasks }) => {
        this.authService.getUser().subscribe((user) => {
          this.userData = user;
          this.photoURL = user['multiFactor']['user']['photoURL']

          console.log(this.userData, "klklkl");
          console.log(this.photoURL, "klklkl");


        })

        this.tasks = tasks
        const cacheKey = 'modeKey';
        this.cacheService.setData(cacheKey, mode);
        this.mode = mode == 'dark' ? true : false;

        if (this.mode) {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
          document.getElementById('main-board').classList.add('main-board-dark');
          document.getElementById('main-board').classList.remove('main-board-light');
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');
          document.getElementById('main-board').classList.add('main-board-light');
          document.getElementById('main-board').classList.remove('main-board-dark');
        }
      }
    })
  }

  ngafterviewinit() {
    if (this.forkSub) {
      this.forkSub.unsubscribe;
    }
  }

  darkMode(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      document.getElementById('main-board').classList.add('main-board-dark');
      document.getElementById('main-board').classList.remove('main-board-light');

      this.mode = true;
      this.cacheService.setData('modeKey', this.mode);
      this.headerService.updateMode('dark').subscribe((res) => {
      })
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.getElementById('main-board').classList.add('main-board-light');
      document.getElementById('main-board').classList.remove('main-board-dark');

      this.mode = false;
      this.cacheService.setData('modeKey', this.mode);
      this.headerService.updateMode('light').subscribe((res) => {
      })
    }
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  deleteAccount() {
    this.authService.deleteCurrentUser()
  }

  logout() {
    this.authService.signOut()
  }

  menuItemClicked(todoId) {

  }

  menuBtn() {
    this.menuOpen = !this.menuOpen
  }
}
