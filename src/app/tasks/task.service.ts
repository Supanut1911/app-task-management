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
          return taskData.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
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

  saveTask(title: string, content: string) {
    const task: Task = { title, content };
    // this.http.post(BACKEND_API + '/task', task).subscribe((response) => {
    //   console.log(response);

    // });
    this.tasks.push(task);
    this.taskUpdated.next([...this.tasks]);
  }
}
