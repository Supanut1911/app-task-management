import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './login.components.html',
  styleUrls: ['./login.components.css'],
})
export class LoginComponent {
  onLogin(formData) {
    console.log('formData', formData.value);
  }
}
