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
  isMenuOpen: string = '';
  isEditLabel: Array<string> = [];
  todoLabelName: string = ''

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
    this.cardService.completedTask(taskId, id).subscribe((res) => {
      this.getLatestData();
    })
  }

  addTodo() {
    this.addTodoText = !this.addTodoText
  }

  ellipseMenu(taskId: string) {
    if (this.isMenuOpen == '')
      this.isMenuOpen = taskId;
    else
      this.isMenuOpen = ''
  }

  menuItemClicked(item: string, todoId: string) {
    if (item == 'delete') {
      this.cardService.deleteTodo(todoId).subscribe((res) => {
        this.getLatestData();
      })

    } else if (item == 'edit') {
      this.isEditLabel.push(todoId);
      let index = this.todos.findIndex((todo) => todo['taskId'] === todoId)
      this.todoLabelName = this.todos[index]['taskLabel']
    }
  }

  onEnterTableLabel(todoId: string) {
    this.cardService.patchTodo(todoId, { taskName: this.todoLabelName }).subscribe((res) => {
      this.getLatestData();
      let index = this.isEditLabel.findIndex((ele) => ele === todoId)
      this.isEditLabel.splice(index, 1);
    })
  }
}
