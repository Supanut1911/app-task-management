import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { map } from 'rxjs';

const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<Task[]>();

  constructor(private readonly http: HttpClient) {}

  getTasks() {
    this.http
      .get<any>(BACKEND_API + '/task')
      .pipe(
        map((taskData) => {
          return taskData.map((task) => {
            return {
              title: task.title,
              description: task.description,
              id: task._id,
            };
          });
        })
      )
      .subscribe((transformTasks: Task[]) => {
        this.tasks = transformTasks;
        this.taskUpdated.next(...[this.tasks]);
      });
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  saveTask(title: string, description: string) {
    console.log('incoming', title, description);

    const task: Task = { id: null, title, description };
    this.http
      .post<{ taskId: string }>(BACKEND_API + '/task/only', task)
      .subscribe((response) => {
        const taskId = response.taskId;
        task.id = taskId;
      });
    this.tasks.push(task);
    this.taskUpdated.next([...this.tasks]);
  }

  deleteTask(taskId: string) {
    this.http.delete(BACKEND_API + '/task/only/' + taskId).subscribe(() => {});
  }
}
