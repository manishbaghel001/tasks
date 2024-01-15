import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from './service/tasks.service';
import { TodosModel } from './models/todos';
import { TasksModel } from './models/tasks';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  constructor(
    private tasksService: TasksService,
    private authService: AuthService
  ) { }

  forkSub: Subscription;
  menuOpen: boolean = false;
  errorMsg = "API failing"
  showProfileOptions: boolean = false;
  email: string;
  password: string;
  userData: any;
  photoURL: string;
  searchValue: string;

  addedTask: string = '';
  addedTodo: string = ''
  isCompletedListOpen: Array<string> = [];
  isAddTodo: string = '';
  todos: any = [];
  todosFix: any = [];
  tasksFix: any = []
  addTasksInput: boolean = false
  isMenuOpen: string = '';
  editTaskLabel: string;
  taskLabelName: string;
  mainBoardName: string;
  tasks: any = [];
  completedTodosCountObj: object;
  uid: any;
  tasksModel: TasksModel;
  todosModel: TodosModel;
  mode: boolean = false;
  checkHover: boolean = false;
  checkedHover: boolean = false;
  hoverOnAddTask: boolean = false;
  editMainBoard: boolean = false;
  mainBoard: string = 'Main Board';
  user: any;

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      if (user) {
        this.user = user;
        this.photoURL = user['photoURL'];
        if (user['uid'] && user['uid'] != '' && user['uid'] != null) {
          this.uid = user['uid'];
          this.getLatestTasks(user['uid'])
        }
      }
    })
  }

  hoverOnAddTaskMtd(task) {
    task['sty'] = true
  }

  hoverOnAddTaskMtd1(task) {
    task['sty'] = false
  }

  onEnterSearch() {
    this.todos = this.todosFix.filter(todo => todo.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    const filteredIds = this.todos.map(todo => todo.id);
    this.tasks = this.tasksFix.filter(task => filteredIds.includes(task.id));
  }

  ngafterviewinit() {
    if (this.forkSub) {
      this.forkSub.unsubscribe;
    }
  }

  darkMode() {
    if (!this.mode) {
      this.mode = true;
      this.tasksService.updateMode({ mode: 'dark' }, this.uid).subscribe((res) => {
      })
    } else {
      this.mode = false;
      this.tasksService.updateMode({ mode: 'light' }, this.uid).subscribe((res) => {
      })
    }
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  switchAccount() {
    this.authService.singInWithGoogle()
    // this.authService.deleteCurrentUser()

  }

  // deleteAccount() {
  //   this.authService.deleteCurrentUser()
  // }

  logout() {
    this.authService.signOut()
  }

  // Card

  editBoard() {
    this.editMainBoard = true;
    this.mainBoardName = this.mainBoard
  }

  onEnterMainBoard() {
    this.tasksService.updateMode({ mainBoard: this.mainBoardName }, this.uid).subscribe((res) => {
      this.editMainBoard = false;
      this.getLatestTasks(this.uid);
    })
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
    this.tasksService.getTasks(uid).subscribe((res) => {
      if (res[0]['todos']) {
        this.tasks = res[0]['tasks'];
        this.todos = res[0]['todos'];
        this.todosFix = cloneDeep(this.todos);
        this.tasksFix = cloneDeep(this.tasks);
        this.completedTodosCountObj = this.completedTodosCount(this.todos);
        this.mode = res[0]['mode'] == 'dark' ? true : false;
        this.mainBoard = res[0]['mainBoard']
      }
    })
  }

  //Add Icon Actions
  addTasksIcon() {
    this.addTasksInput = true
    this.addedTask = "";
  }

  plusIconBtn() {
    this.addTasksInput = false
    this.addedTask = "";
  }

  onEnterTask() {
    if (this.addedTask != '') {
      this.tasksModel = new TasksModel()
      this.tasksModel.setModel(undefined, this.addedTask)
      this.tasksService.createTasks(this.tasksModel, this.uid).subscribe((res) => {
        this.getLatestTasks(this.uid);
        this.addedTask = ''
        this.addTasksInput = false
      })
    } else {
      alert("Please enter name of task")
    }
  }

  onEnterCardLabel(taskId: string) {
    if (this.editTaskLabel != '') {
      this.tasksModel = new TasksModel();
      this.tasksModel.setModel(taskId, this.taskLabelName);
      this.tasksService.patchTasks(this.uid, this.tasksModel).subscribe((res) => {
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
      this.tasksService.patchTasks(this.uid, this.tasksModel).subscribe((res) => {
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
      this.tasksService.createTodo(this.uid, this.todosModel).subscribe((res) => {
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
    this.todosModel.setModel(todo['id'], todo['name'], true, todo['deleted'], todo['todoId'])
    this.tasksService.patchTodo(this.uid, this.todosModel).subscribe((res) => {
      this.getLatestTasks(this.uid);
    })
  }

  //Completed Tasks
  deleteCompleteList(todo: string) {
    this.todosModel = new TodosModel()
    this.todosModel.setModel(todo['id'], todo['name'], todo['completed'], true, todo['todoId'])
    this.tasksService.patchTodo(this.uid, this.todosModel).subscribe((res) => {
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
