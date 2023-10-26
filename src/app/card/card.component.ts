import { Component, NgZone } from '@angular/core';
import { CardService } from './service/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  constructor(
    private cardService: CardService,
    private ngZone: NgZone
  ) { }

  addedTask: string = '';
  isListOpen: Array<string> = [];
  todosObj: any;
  todos: any;
  toggleIcon: string = '^';
  addTaskText: string = '';

  ngOnInit() {
    this.getLatestData();
  }

  getLatestData() {
    this.cardService.getJson().subscribe((res) => {
      console.log(res, "manish");
      this.todos = res;
      this.todosObj = Object.keys(res);
    })
  }

  toggleList(todoKey: string) {
    console.log(todoKey, "klklklkl");
    this.toggleIcon = 'v';
    this.isListOpen.push(todoKey);
  }

  deleteCompleteList(todoKey: string, id: any) {
    console.log(todoKey, id, "klklklkl");
    this.cardService.deleteCompletedTask(todoKey, id).subscribe((res) => {
      this.getLatestData();
    })
  }

  addTask(todoKey: string) {
    this.addTaskText = todoKey;
  }

  onEnter(todoKey: string) {
    let body = {
      name: this.addedTask
    }
    this.cardService.postJson(todoKey, body).subscribe((res) => {
      this.getLatestData();
      this.addedTask = ''
    })
  }

  onCheckboxClick(taskId: any, id: any) {
    console.log(taskId, id, "klklkl");

    this.cardService.completedTask(taskId, id).subscribe((res) => {
      this.getLatestData();
    })
  }
}