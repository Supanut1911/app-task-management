import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  isLoading = false;

  //paginate
  totalTasks = 0;
  tasksPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20];

  private tasksSub: Subscription;

  constructor(public readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.tasksSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { tasks: Task[]; taskCount: number }) => {
        this.tasks = taskData.tasks;
        this.totalTasks = taskData.taskCount;
        this.isLoading = false;
      });
  }

  onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe((response) => {
      this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    });
  }

  //panigate
  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
  }
}
