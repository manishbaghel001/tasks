import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
  ) { }

  ngOnInit() {
  }

  darkMode() {
    let mode = document.querySelector('.mat-toolbar');
    mode?.classList.add('dark-mode');
    mode?.classList.remove('light-mode');
  }

  lightMode() {
    let mode = document.querySelector('.mat-toolbar');
    mode?.classList.add('light-mode');
    mode?.classList.remove('dark-mode');
  }
}
