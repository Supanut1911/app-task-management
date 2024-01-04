import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];

  getTasks() {
    return [...this.tasks];
  }

  saveTask(title: string, content: string) {
    const task: Task = { title, content };
    this.tasks.push(task);
  }
}
