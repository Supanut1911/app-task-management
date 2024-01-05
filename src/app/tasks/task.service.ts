import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskUpdated = new Subject<Task[]>();

  getTasks() {
    return [...this.tasks];
  }

  getTaskUpdateListener() {
    return this.taskUpdated.asObservable();
  }

  saveTask(title: string, content: string) {
    const task: Task = { title, content };
    this.tasks.push(task);
    console.log('task', this.tasks);

    this.taskUpdated.next([...this.tasks]);
  }
}
