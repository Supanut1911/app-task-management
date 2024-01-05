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
  isLoading = false;

  //paginate
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  private tasksSub: Subscription;

  constructor(public readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.taskService.getTasks();
    this.tasksSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((task: Task[]) => {
        this.tasks = task;
        this.isLoading = false;
      });
  }

  onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId);
  }

  //panigate
  onChangePage(page: number) {}

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}
