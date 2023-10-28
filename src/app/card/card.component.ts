import { Component } from '@angular/core';
import { CardService } from './service/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  constructor(
    private cardService: CardService
  ) { }

  addedTask: string = '';
  addedTodo: string = ''
  isListOpen: Array<string> = [];
  isAddTask: Array<string> = [];
  todosObj: any;
  todos: any;
  todosTemp: any;
  addTodoText: boolean = false

  ngOnInit() {
    this.getLatestData();
  }

  getLatestData() {
    this.cardService.getJson().subscribe((res) => {
      console.log(res, "manish");
      this.todosTemp = res;
      this.todos = this.todosTemp['tasks'];
      this.todosObj = Object.keys(res);
    })
  }

  toggleList(todoKey: string) {
    if (this.isListOpen.includes(todoKey)) {
      let index = this.isListOpen.findIndex((ele) => ele === todoKey)
      this.isListOpen.splice(index, 1);
    } else {
      this.isListOpen.push(todoKey);
    }
  }

  deleteCompleteList(todoKey: string, id: any) {
    console.log(todoKey, id, "klklklkl");
    this.cardService.deleteCompletedTask(todoKey, id).subscribe((res) => {
      this.getLatestData();
    })
  }

  addTask(todoKey: string) {
    if (this.isAddTask.includes(todoKey)) {
      let index = this.isAddTask.findIndex((ele) => ele === todoKey)
      this.isAddTask.splice(index, 1);
    } else {
      this.isAddTask.push(todoKey);
    }
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

  onEnterTodo() {
    let body = {
      taskName: this.addedTodo
    }
    const stringWithoutSpaces = this.addedTodo.replace(/ /g, "");
    this.cardService.createTodo(body, stringWithoutSpaces).subscribe((res) => {
      this.getLatestData();
      this.addedTodo = ''
    })
  }

  onCheckboxClick(taskId: any, id: any) {
    console.log(taskId, id, "klklkl");

    this.cardService.completedTask(taskId, id).subscribe((res) => {
      this.getLatestData();
    })
  }

  addTodo() {
    this.addTodoText = !this.addTodoText
  }
}
