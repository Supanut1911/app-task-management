import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
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
  userIsAuthenticated = false;
  userId: string;
  private tasksSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public readonly taskService: TaskService,
    private readonly authService: AuthService,
    private readonly toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.tasksSub = this.taskService
      .getTaskUpdateListener()
      .subscribe((taskData: { tasks: Task[]; taskCount: number }) => {
        this.tasks = taskData.tasks;
        this.totalTasks = taskData.taskCount;
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDeleteTask(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(
      (response) => {
        this.toastService.success('Delete successful');
        this.taskService.getTasks(this.tasksPerPage, this.currentPage);
      },
      (error) => {
        const errorMsg = error.error.message;
        this.toastService.error(errorMsg);
      }
    );
  }

  //panigate
  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.tasksPerPage = pageData.pageSize;
    this.taskService.getTasks(this.tasksPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
