import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<Task[]>();

  constructor(private readonly http: HttpClient) {}

  getTasks() {
    this.http.get<Task[]>(BACKEND_API + '/task').subscribe((tasks: Task[]) => {
      this.tasks = tasks;
      this.taskUpdated.next(...[this.tasks]);
    });
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  saveTask(title: string, content: string) {
    const task: Task = { title, content };
    this.tasks.push(task);

    this.taskUpdated.next([...this.tasks]);
  }
}
