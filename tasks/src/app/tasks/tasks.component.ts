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
      console.log(response, "manish");

      this.updateFile = response
    })
  }

  updateJsonFile() {
    this.updateFile['data'][0]['data'] = "Manish"
    this.tasksService.postJson(this.updateFile).subscribe((res) => {
      console.log(res, "klklkl");
      this.tasksService.getJson().subscribe((response) => {
        console.log(response, "manish1234");

        // this.updateFile = response
      })

    })
  }
  handleButtonClick() {
    this.updateJsonFile()
  }
}
