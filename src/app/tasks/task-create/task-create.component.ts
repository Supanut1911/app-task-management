import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../task.model';
import { TaskService } from '../task.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css'],
})
export class TaskCreateComponent implements OnInit {
  task: Task;
  mode = 'create';
  isLoading = false;
  private taskId: string;

  constructor(
    public readonly taskService: TaskService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        this.mode = 'edit';
        this.taskId = paramMap.get('taskId');
        this.isLoading = true;
        this.taskService.getTask(this.taskId).subscribe((taskData) => {
          this.isLoading = false;
          this.task = {
            id: taskData._id,
            title: taskData.title,
            description: taskData.description,
            creator: taskData.creator,
            isActive: taskData.isActive,
          };
        });
      } else {
        this.mode = 'create';
        this.taskId = null;
      }
    });
  }

  onSaveTask(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const title = form.value.title;
    const description = form.value.description;

    this.isLoading = true;
    if (this.mode === 'create') {
      this.taskService.saveTask(title, description);
    } else {
      this.taskService.updateTask(this.taskId, title, description);
    }

    form.resetForm();
  }
}
