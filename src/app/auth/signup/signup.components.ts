import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  templateUrl: './signup.components.html',
  styleUrls: ['./signup.components.css'],
})
export class SignupComponent {
  onSignup(formData) {
    console.log('formData', formData.value);
  }
}
