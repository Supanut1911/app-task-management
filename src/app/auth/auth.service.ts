import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accesstoken: string;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  getAccessToken() {
    return this.accesstoken;
  }

  createUser(username: string, password: string) {
    const authData: AuthData = {
      username,
      password,
    };
    this.http
      .post<AuthData>(BACKEND_API + '/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/login']);
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = {
      username,
      password,
    };
    this.http
      .post<{ accessToken: string }>(BACKEND_API + '/auth/login', authData)
      .subscribe((response) => {
        this.router.navigate(['/']);
        this.accesstoken = response.accessToken;
      });
  }
}
