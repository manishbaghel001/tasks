import { Component, Input, OnInit } from '@angular/core';
import { CardService } from './service/card.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TasksModel } from './models/tasks';
import { TodosModel } from './models/todos';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() userData: any;
  constructor(
    private cardService: CardService,
    private authService: AuthService
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
  uid: any;
  tasksModel: TasksModel;
  todosModel: TodosModel;

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        if (user['uid'] && user['uid'] != '' && user['uid'] != null) {
          this.uid = user['uid'];
          this.getLatestTasks(user['uid'])
        }
      }
    })
  }

  ngafterviewinit() {
    if (this.forkSub) {
      this.forkSub.unsubscribe;
    }
  }

  completedTodosCount(todos) {
    const completedTasks = {};
    for (const obj of todos) {
      if (obj.completed === true && obj.deleted === false) {
        const id = obj.id;
        if (!completedTasks[id]) {
          completedTasks[id] = 0;
        }
        completedTasks[id]++;
      }
    }
    return completedTasks;
  }

  getLatestTasks(uid) {
    this.cardService.getTasks(uid).subscribe((res) => {
      this.tasks = res[0]['tasks'];
      this.todos = res[0]['todos']
      this.completedTodosCountObj = this.completedTodosCount(this.todos)
    })
  }

  //Add Icon Actions
  addTasksIcon() {
    this.addTasksInput = !this.addTasksInput
    this.addedTask = "";
  }

  onEnterTask() {
    if (this.addedTask != '') {
      this.tasksModel = new TasksModel()
      this.tasksModel.setModel(undefined, this.addedTask)
      this.cardService.createTasks(this.tasksModel, this.uid).subscribe((res) => {
        this.getLatestTasks(this.uid);
        this.addedTask = ''
      })
    } else {
      alert("Please enter name of task")
    }
  }

  onEnterCardLabel(taskId: string) {
    if (this.editTaskLabel != '') {
      this.tasksModel = new TasksModel();
      this.tasksModel.setModel(taskId, this.taskLabelName);
      this.cardService.patchTasks(this.uid, this.tasksModel).subscribe((res) => {
        this.getLatestTasks(this.uid);
        this.editTaskLabel = ''
      })
    } else {
      alert("Please enter name of task")
    }
  }

  ellipseMenu(taskId: string) {
    if (this.isMenuOpen == taskId)
      this.isMenuOpen = "";
    else
      this.isMenuOpen = taskId
  }

  menuItemClicked(item: string, task: any) {
    if (item == 'delete') {
      this.tasksModel = new TasksModel();
      this.tasksModel.setModel(task['id'], task['name'], true)
      this.cardService.patchTasks(this.uid, this.tasksModel).subscribe((res) => {
        this.isMenuOpen = "";
        this.getLatestTasks(this.uid);
      })
    } else if (item == 'edit') {
      this.editTaskLabel = task['id'];
      let searcedTasks = this.tasks.find((task) => task['id'] === task['id'])
      this.taskLabelName = searcedTasks['name'];
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
    if (this.addedTodo != '') {
      this.todosModel = new TodosModel()
      this.todosModel.setModel(todoId, this.addedTodo)
      this.cardService.createTodo(this.uid, this.todosModel).subscribe((res) => {
        this.getLatestTasks(this.uid);
        this.addedTodo = ''
      })
    } else {
      alert("Please enter name of todo")
    }
  }

  //Todo checkbox
  onCheckboxClick(todo: any) {
    this.todosModel = new TodosModel()
    this.todosModel.setModel(todo['id'], todo['name'], true)
    this.cardService.patchTodo(this.uid, this.todosModel).subscribe((res) => {
      this.getLatestTasks(this.uid);
    })
  }

  //Completed Tasks
  deleteCompleteList(todo: string) {
    this.todosModel = new TodosModel()
    this.todosModel.setModel(todo['id'], todo['name'], undefined, true)
    this.cardService.patchTodo(this.uid, this.todosModel).subscribe((res) => {
      this.getLatestTasks(this.uid);
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
}
