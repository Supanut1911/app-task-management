import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
})
export class TaskCreateComponent {
  constructor(public readonly taskService: TaskService) {}

  onSaveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const title = form.value.title;
    const content = form.value.content;

    this.taskService.saveTask(title, content);
    form.resetForm();
  }
}
