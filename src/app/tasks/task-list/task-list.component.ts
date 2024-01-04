import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  @Input() tasks = [
    {
      title: '1st post',
      content: 'lorem1',
    },
    {
      title: '2st post',
      content: 'lorem2',
    },
    {
      title: '3st post',
      content: 'lorem3',
    },
  ];

  constructor(public readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }
}
