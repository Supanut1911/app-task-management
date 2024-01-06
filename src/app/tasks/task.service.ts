import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<{
    tasks: Task[];
    taskOngoingCount: number;
    taskDoneCount: number;
  }>();

  constructor(
    private readonly http: HttpClient,
    private router: Router,
    private toastService: ToastrService
  ) {}

  getTasks(taskPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${taskPerPage}&page=${currentPage}`;
    this.http
      .get<{
        msg: string;
        tasks: any[];
        countOngoingTasks: number;
        countDoneTasks;
      }>(BACKEND_API + '/task' + queryParams)
      .pipe(
        map((taskData) => {
          return {
            tasks: taskData.tasks.map((task) => {
              return {
                title: task.title,
                description: task.description,
                id: task._id,
                creator: task.creator,
                isActive: task.isActive,
              };
            }),
            maxOngoingTasks: taskData.countOngoingTasks,
            maxDoneTask: taskData.countDoneTasks,
          };
        })
      )
      .subscribe(
        (transformTasksData) => {
          console.log('>>transformTasksData, ', transformTasksData);

          this.tasks = transformTasksData.tasks;
          this.taskUpdated.next({
            tasks: [...this.tasks],
            // taskCount: transformTasksData.maxTasks,
            taskOngoingCount: transformTasksData.maxOngoingTasks,
            taskDoneCount: transformTasksData.maxDoneTask,
          });
        },
        (error) => {
          this.toastService.error('Error fetching data from server');
        }
      );
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  getTask(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      creator: string;
      isActive: boolean;
    }>(BACKEND_API + '/task/' + id);
  }

  saveTask(title: string, description: string) {
    const task: Task = {
      id: null,
      title,
      description,
      creator: null,
      isActive: null,
    };
    this.http.post<{ taskId: string }>(BACKEND_API + '/task', task).subscribe(
      (response) => {
        this.toastService.success('Create task successful');
        this.router.navigate(['/']);
      },
      (error) => {
        const errorMsg = error.error.message;
        this.toastService.error(errorMsg);
      }
    );
  }

  updateTask(taskId: string, title: string, description: string) {
    const task: Task = {
      id: taskId,
      title,
      description,
      creator: null,
      isActive: false,
    };
    this.http.patch(BACKEND_API + '/task/' + taskId, task).subscribe(
      (response) => {
        this.toastService.success('Update task successful');
        this.router.navigate(['/']);
      },
      (error) => {
        const errorMsg = error.error.message;
        this.toastService.error(errorMsg);
      }
    );
  }

  deleteTask(taskId: string) {
    return this.http.delete(BACKEND_API + '/task/' + taskId);
  }

  updateTaskStatus(taskId: string) {
    return this.http.patch(BACKEND_API + '/task/status/' + taskId, null);
  }
}
