import { Component } from '@angular/core';
import { CardService } from '../card/service/card.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private cardService: CardService
  ) { }
  mode: string = ''
  todos: any

  ngOnInit() {
    this.cardService.getJson().subscribe((res) => {
      this.todos = res
      this.mode = this.todos['mode'];
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
    this.cardService.updateMode('dark').subscribe((res) => {
      this.mode = 'dark';
    })
  }

  lightMode() {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    this.cardService.updateMode('light').subscribe((res) => {
      this.mode = 'light';
    })
  }
}
