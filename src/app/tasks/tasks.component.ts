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
  updateFile: any;
  ngOnInit() {
    this.tasksService.getJson().subscribe((response) => {
      console.log(response, "klklklklklkl");

    })
    this.tasksService.postJson().subscribe((response) => {
      console.log(response, "klklklklklkl");
      this.updateFile = response

    })
  }
  handleButtonClick() {
    this.tasksService.updateJsonFile(this.updateFile).subscribe(
      (response) => {
        console.log('JSON file updated successfully:', response);
        // You may want to handle success here
      })
  }
}
