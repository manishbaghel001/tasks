import { Component } from '@angular/core';
import { HeaderService } from './service/header.service';
import { Subscription, catchError, forkJoin, of } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private headerService: HeaderService,
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
        this.mode = mode[0]['mode'];
        if (this.mode == 'dark') {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');
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
    this.headerService.updateMode('dark').subscribe((res) => {
      this.mode = 'dark';
    })
  }

  lightMode() {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    this.headerService.updateMode('light').subscribe((res) => {
      this.mode = 'light';
    })
  }

  menuItemClicked(todoId) {

  }

  menuBtn() {
    this.menuOpen = !this.menuOpen
  }
}
