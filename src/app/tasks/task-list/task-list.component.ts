import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  tasks = [
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
}
