import { Component } from '@angular/core';
import { TasksService } from './service/tasks.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {
  constructor(
    private tasksService: TasksService
  ) { }
  todos: any;
  ngOnInit() {
    this.tasksService.getJson().subscribe((res) => {
      console.log(res, "manish");
      this.todos = res
    })
  }

  onCheckboxChange(item: any): void {
    item.selected = !item.selected;
    if (item.selected) {
      this.tasksService.deleteJson(item['id']).subscribe((res) => {
        console.log(res, "klklkl");
      })
    }
  }

  callApi(): void {
    let data = { "name": "Manish" + this.todos.length }
    this.tasksService.postJson(data).subscribe((res) => {
      console.log(res, "klklkl");
      this.todos = res
    })
  }

}
