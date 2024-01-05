import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];

  private tasksSub: Subscription;

  constructor(public readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks();
    this.tasksSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((task: Task[]) => {
        this.tasks = task;
      });
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}
