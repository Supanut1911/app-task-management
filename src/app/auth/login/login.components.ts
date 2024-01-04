import { Component } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './login.components.html',
  styleUrls: ['./login.components.css'],
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) {}

  onLogin(form: NgForm) {
    // prevent case input null or empty string
    if (form.invalid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    this.authService.login(username, password);
  }
}
