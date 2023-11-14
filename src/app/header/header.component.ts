import { Component } from '@angular/core';
import { HeaderService } from './service/header.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { CacheService } from '../cache/cache.service';
import { catchError } from 'rxjs/operators'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private headerService: HeaderService,
    private cacheService: CacheService
  ) { }
  forkSub: Subscription;
  mode: string;
  tasks: any;
  menuOpen: boolean = false;
  errorMsg = "API failing"

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
        this.tasks = tasks
        const cacheKey = 'modeKey';
        this.cacheService.setData(cacheKey, mode);
        this.mode = mode;

        if (this.mode == 'dark') {
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

  darkMode() {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    document.getElementById('main-board').classList.add('main-board-dark');
    document.getElementById('main-board').classList.remove('main-board-light');

    this.mode = 'dark';
    this.cacheService.setData('modeKey', this.mode);
    this.headerService.updateMode('dark').subscribe((res) => {
    })
  }

  lightMode() {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    document.getElementById('main-board').classList.add('main-board-light');
    document.getElementById('main-board').classList.remove('main-board-dark');

    this.mode = 'light';
    this.cacheService.setData('modeKey', this.mode);
    this.headerService.updateMode('light').subscribe((res) => {
    })
  }

  menuItemClicked(todoId) {

  }

  menuBtn() {
    this.menuOpen = !this.menuOpen
  }
}
