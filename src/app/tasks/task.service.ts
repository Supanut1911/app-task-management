import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';
import { Router } from '@angular/router';

const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<{ tasks: Task[]; taskCount: number }>();

  constructor(private readonly http: HttpClient, private router: Router) {}

  getTasks(taskPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${taskPerPage}&page=${currentPage}`;
    this.http
      .get<{ msg: string; tasks: any[]; maxTasks: number }>(
        BACKEND_API + '/task' + queryParams
      )
      .pipe(
        map((taskData) => {
          return {
            tasks: taskData.tasks.map((task) => {
              return {
                title: task.title,
                description: task.description,
                id: task._id,
              };
            }),
            maxTasks: taskData.maxTasks,
          };
        })
      )
      .subscribe((transformTasksData) => {
        this.tasks = transformTasksData.tasks;
        this.taskUpdated.next({
          tasks: [...this.tasks],
          taskCount: transformTasksData.maxTasks,
        });
      });
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  getTask(id: string) {
    return this.http.get<{ _id: string; title: string; description: string }>(
      BACKEND_API + '/task/' + id
    );
  }

  saveTask(title: string, description: string) {
    const task: Task = { id: null, title, description };
    this.http
      .post<{ taskId: string }>(BACKEND_API + '/task/only', task)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  updateTask(taskId: string, title: string, description: string) {
    const task: Task = {
      id: taskId,
      title,
      description,
    };
    this.http
      .patch(BACKEND_API + '/task/only/' + taskId, task)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deleteTask(taskId: string) {
    return this.http.delete(BACKEND_API + '/task/only/' + taskId);
  }
}
