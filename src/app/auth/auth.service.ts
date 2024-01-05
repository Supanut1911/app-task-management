import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Subject, Subscribable, Subscription } from 'rxjs';
const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private accesstoken: string;
  private authStatusListener = new Subject<boolean>();

  //for timeout
  private tokenTimer: any;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  getAccessToken() {
    return this.accesstoken;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(username: string, password: string) {
    const authData: AuthData = {
      username,
      password,
    };
    this.http
      .post<AuthData>(BACKEND_API + '/user/signup', authData)
      .subscribe((response) => {
        this.router.navigate(['/login']);
      });
  }

  login(username: string, password: string) {
    const authData: AuthData = {
      username,
      password,
    };
    this.http
      .post<{ accessToken: string; expireIn: number }>(
        BACKEND_API + '/auth/login',
        authData
      )
      .subscribe((response) => {
        this.accesstoken = response.accessToken;
        if (this.accesstoken) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);

          //lifetime of accessToken
          const expiresInDuration = response.expireIn * 1000;
          this.tokenTimer = setTimeout(() => {
            this.logout();
          }, expiresInDuration);
        }
      });
  }

  logout() {
    this.accesstoken = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);

    //clear time out
    clearTimeout(this.tokenTimer);

    //redirect
    this.router.navigate(['/']);
  }
}
