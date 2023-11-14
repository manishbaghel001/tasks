import { Component } from '@angular/core';
import { CardService } from './service/card.service';
import { Subscription } from 'rxjs';
import { CacheService } from '../cache/cache.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  constructor(
    private cardService: CardService,
    private cacheService: CacheService
  ) { }

  forkSub: Subscription;
  addedTask: string = '';
  addedTodo: string = ''
  isCompletedListOpen: Array<string> = [];
  isAddTodo: string = '';
  todos: any;
  addTasksInput: boolean = false
  isMenuOpen: string = '';
  editTaskLabel: string;
  taskLabelName: string;
  tasks: any;
  completedTodosCountObj: object;

  ngOnInit() {
    this.getLatestTasks()
    this.getLatestTodos()
  }

  ngafterviewinit() {
    if (this.forkSub) {
      this.forkSub.unsubscribe;
    }
  }

  getLatestTodos() {
    this.cardService.getTodos().subscribe((res) => {
      this.todos = res;
      this.completedTodosCountObj = this.completedTodosCount(this.todos)
    })
  }

  completedTodosCount(todos) {
    const completedTasks = {};
    for (const obj of todos) {
      if (obj.completed === true && obj.deleted === false) {
        const taskId = obj.taskId;
        if (!completedTasks[taskId]) {
          completedTasks[taskId] = 0;
        }
        completedTasks[taskId]++;
      }
    }
    return completedTasks;
  }

  getLatestTasks() {
    this.cardService.getTasks().subscribe((res) => {
      this.tasks = res;
      console.log(this.tasks, "klklklkl");

    })
  }

  //Add Icon Actions
  addTasksIcon() {
    this.addTasksInput = !this.addTasksInput
    this.addedTask = "";
  }

  onEnterTask() {
    let body = {
      taskLabel: this.addedTask
    }
    this.cardService.createTasks(body).subscribe((res) => {
      this.getLatestTasks();
      this.addedTask = ''
    })
  }

  onEnterCardLabel(taskId: string) {
    this.cardService.patchTasks(taskId, { taskLabel: this.taskLabelName }).subscribe((res) => {
      this.getLatestTasks();
      this.editTaskLabel = ''
    })
  }

  ellipseMenu(taskId: string) {
    if (this.isMenuOpen == taskId)
      this.isMenuOpen = "";
    else
      this.isMenuOpen = taskId
  }

  menuItemClicked(item: string, taskId: string) {
    if (item == 'delete') {
      this.cardService.deleteTasks(taskId).subscribe((res) => {
        this.cardService.deleteTodosBatch(taskId).subscribe((res) => {
          this.isMenuOpen = "";
          this.getLatestTasks();
        })
      })
    } else if (item == 'edit') {
      this.editTaskLabel = taskId;
      let searcedTasks = this.tasks.find((task) => task['_id'] === taskId)
      this.taskLabelName = searcedTasks['taskLabel'];
      this.isMenuOpen = "";
    }
  }

  //Add Tasks button
  addTodo(taskId: string) {
    if (this.isAddTodo == taskId) {
      this.isAddTodo = ''
    } else {
      this.isAddTodo = taskId;
      this.addedTodo = ''
    }
  }

  onEnterTodo(todoId: string) {
    let body = {
      todoName: this.addedTodo
    }
    this.cardService.createTodo(todoId, body).subscribe((res) => {
      this.getLatestTodos();
      this.addedTodo = ''
    })
  }

  //Todo checkbox
  onCheckboxClick(todoId: any) {
    this.cardService.completeTodo(todoId).subscribe((res) => {
      this.getLatestTodos();
    })
  }

  //Completed Tasks
  deleteCompleteList(todoId: string) {
    this.cardService.deleteTodo(todoId).subscribe((res) => {
      this.getLatestTodos();
    })
  }

  toggleForCompletedList(taskId: string) {
    if (this.isCompletedListOpen.includes(taskId)) {
      let index = this.isCompletedListOpen.findIndex((ele) => ele === taskId)
      this.isCompletedListOpen.splice(index, 1);
    } else {
      this.isCompletedListOpen.push(taskId);
    }
  }

  closePopUp() {
    // Find the closest element that matches the selector.

    document.getElementById('pop-up').style.display = 'none';
  }
}
