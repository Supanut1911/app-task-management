import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.components';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SignupComponent } from './auth/signup/signup.components';
import { HttpClientModule } from '@angular/common/http';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { MatExpansionModule } from '@angular/material/expansion';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    TaskCreateComponent,
    TaskListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    HttpClientModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
