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
  onGoingtasks: Task[] = [];
  doneTasks: Task[] = [];
  isLoading = false;

  //paginate
  totalTasks = 0;
  tasksPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 20];

  //on going
  totalOngoingTasks = 0;
  ongoingTasksPerPage = 5;
  ongoingCurrentPage = 1;
  ongoingPageSizeOptions = [5, 10];

  //done
  totalDoneTasks = 0;
  doneTasksPerPage = 5;
  doneCurrentPage = 1;
  donePageSizeOptions = [5, 10];

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
      .subscribe(
        (taskData: {
          tasks: Task[];
          taskOngoingCount: number;
          taskDoneCount: number;
        }) => {
          this.tasks = taskData.tasks;

          this.totalOngoingTasks = taskData.taskOngoingCount;
          this.totalDoneTasks = taskData.taskDoneCount;

          this.onGoingtasks = this.tasks.filter(
            (post) => post.isActive === true
          );
          this.doneTasks = this.tasks.filter((post) => post.isActive === false);

          this.isLoading = false;
        }
      );
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

  onDonePost(postId: string) {
    this.taskService.updateTaskStatus(postId).subscribe(() => {
      this.taskService.getTasks(this.ongoingTasksPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
