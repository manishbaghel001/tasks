import { Component } from '@angular/core';
import { CardService } from '../card/service/card.service';
import { HeaderService } from './service/header.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private cardService: CardService,
    private headerService: HeaderService,
  ) { }
  mode: string = ''
  todos: any;
  menuOpen: boolean = false

  ngOnInit() {
    this.cardService.getJson().subscribe((res) => {
      this.todos = res['tasks']
    })
    this.headerService.getJson().subscribe((res: string) => {
      this.mode = res;
      if (this.mode == 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    })
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
