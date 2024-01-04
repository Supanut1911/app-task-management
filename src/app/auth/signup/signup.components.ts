import { Component } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
@Component({
  templateUrl: './signup.components.html',
  styleUrls: ['./signup.components.css'],
})
export class SignupComponent {
  constructor(private readonly authService: AuthService) {}

  onSignup(form: NgForm) {
    // prevent case input null or empty string
    if (form.invalid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    this.authService.createUser(username, password);
  }
}
