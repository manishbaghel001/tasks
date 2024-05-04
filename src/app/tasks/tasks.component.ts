import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from './service/tasks.service';
import { TodosModel } from './models/todos';
import { TasksModel } from './models/tasks';
import { cloneDeep } from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})

export class TasksComponent implements OnInit {

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.rememberMe = history.state?.['rememberMe'];
  }

  @ViewChild('inputCardLabelRef') inputCardLabelRef: ElementRef;
  @ViewChild('mainBoardRef') mainBoardRef: ElementRef;

  rememberMe: any;
  forkSub: Subscription;
  menuOpen: boolean = false;
  errorMsg = "API failing"
  showProfileOptions: boolean = false;
  password: string;
  userData: any;
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
  editTaskLabel: string = '';
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
  photoURL: any;
  display = 'none';
  displayName: string;
  userCache: any;
  showLoader: boolean = false;

  openModal() {
    this.display = 'flex'
  }

  closePopup() {
    this.display = 'none'
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.showLoader = true;
    this.tasksService.uploadImage(file, this.uid).subscribe((response) => {
      this.getImage()
    });
  }

  getImage(): void {
    this.tasksService.getImage(this.uid).subscribe((buffer: ArrayBuffer) => {
      this.showLoader = false;
      if (buffer.byteLength > 0) {
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(blob);
        this.photoURL = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
      }
      else {
        if (this.userCache) {
          this.photoURL = this.userCache['photoURL'] ? this.userCache['photoURL'] : '';
        }
        else {
          this.photoURL = ''
        }
      }
    });
  }

  removeImage() {
    const file: File = null;
    this.showLoader = true;
    this.tasksService.uploadImage(file, this.uid).subscribe((response) => {
      this.showLoader = false;
      if (this.userCache) {
        this.photoURL = this.userCache['photoURL'] ? this.userCache['photoURL'] : '';
      }
      else {
        this.photoURL = ''
      }
    })
  }

  async ngOnInit() {
    this.showLoader = true
    await this.authService.getUserdata().then((user) => {
      this.userCache = user
      if (this.userCache && this.userCache != null) {
        this.displayName = this.userCache['displayName'].split(' ')[0];
        if (this.userCache['uid'] && this.userCache['uid'] != '' && this.userCache['uid'] != null) {
          this.uid = this.userCache['uid'];
          this.getLatestTasks(this.userCache['uid'])
        }
      }
      else {
        this.router.navigate(['/login'])
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

  ngAfterViewInit() {
    if (this.forkSub) {
      this.forkSub.unsubscribe;
    }
  }

  darkMode() {
    this.showLoader = true;
    if (!this.mode) {
      this.mode = true;
      this.tasksService.updateMode({ mode: 'dark' }, this.uid).subscribe((res) => {
        this.showLoader = false;
      })
    } else {
      this.mode = false;
      this.tasksService.updateMode({ mode: 'light' }, this.uid).subscribe((res) => {
        this.showLoader = false;
      })
    }
  }

  toggleProfileOptions() {
    this.showProfileOptions = !this.showProfileOptions;
  }

  switchAccount() {
    this.authService.signInWithGoogle()
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
    this.mainBoardName = this.mainBoard;
    setTimeout(() => {
      this.mainBoardRef.nativeElement.select();
    }, 0);
  }

  onEnterMainBoard() {
    this.showLoader = true
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
    if (this.userCache) {
      this.photoURL = this.userCache['photoURL'] ? this.userCache['photoURL'] : '';
    }
    else {
      this.photoURL = ''
    }
    this.tasksService.getTasks(uid).subscribe((res: any) => {
      if (res.length > 0) {
        if (res[0]['rememberMe'] == 'false') {
          this.tasksService.updateMode({ rememberMe: 'true' }, this.uid).subscribe((res) => {
            this.router.navigate(['/login'], { state: { rememberMe: "false" } })
          })
        } else {
          if (this.rememberMe == 'false') {
            this.tasksService.updateMode({ rememberMe: 'false' }, this.uid).subscribe((res) => {
            })
          }
          if (res[0]['todos']) {
            this.tasks = res[0]['tasks'];
            this.todos = res[0]['todos'];
            this.todosFix = cloneDeep(this.todos);
            this.tasksFix = cloneDeep(this.tasks);
            this.completedTodosCountObj = this.completedTodosCount(this.todos);
            this.mode = res[0]['mode'] == 'dark' ? true : false;
            this.mainBoard = res[0]['mainBoard'];
            this.getImage();
          }
        }
      }
      else {
        this.showLoader = false
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
      this.showLoader = true;
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
      this.showLoader = true;
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

  menuItemClicked(item: string, taskId: any, taskName: any) {
    if (item == 'delete') {
      this.showLoader = true;
      this.tasksModel = new TasksModel();
      this.tasksModel.setModel(taskId, taskName, true)
      this.tasksService.patchTasks(this.uid, this.tasksModel).subscribe((res) => {
        this.isMenuOpen = "";
        this.getLatestTasks(this.uid);
      })
    } else if (item == 'edit') {
      this.editTaskLabel = taskId;
      this.taskLabelName = taskName;
      this.isMenuOpen = "";
      setTimeout(() => {
        this.inputCardLabelRef.nativeElement.select();
      }, 0);
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
      this.showLoader = true;
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
    this.showLoader = true;
    this.todosModel = new TodosModel()
    this.todosModel.setModel(todo['id'], todo['name'], true, todo['deleted'], todo['todoId'])
    this.tasksService.patchTodo(this.uid, this.todosModel).subscribe((res) => {
      this.getLatestTasks(this.uid);
    })
  }

  //Completed Tasks
  deleteCompleteList(todo: string) {
    this.showLoader = true;
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
