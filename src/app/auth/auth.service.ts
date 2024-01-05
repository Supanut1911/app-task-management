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
          const expiresInDuration = response.expireIn;

          //authTimer
          this.setAuthTimer(expiresInDuration);

          //save accesstoken & expireation to localstorage
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );

          this.saveAuthData(this.accesstoken, expirationDate);

          this.isAuthenticated = true;
          this.authStatusListener.next(true);

          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    this.accesstoken = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);

    //clear time out
    clearTimeout(this.tokenTimer);

    //claer localstorage
    this.clearAuthData();

    //redirect
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expireIn = authInfo.expireationDate.getTime() - now.getTime();
    if (expireIn > 0) {
      this.accesstoken = authInfo.accessToken;
      this.isAuthenticated = true;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private saveAuthData(accessToken: string, expireIn: Date) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('expiration', expireIn.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const accessToken = localStorage.getItem('accessToken');
    const expirationDate = localStorage.getItem('expiration');
    if (!accessToken || !expirationDate) {
      return;
    }
    return {
      accessToken,
      expireationDate: new Date(expirationDate),
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
