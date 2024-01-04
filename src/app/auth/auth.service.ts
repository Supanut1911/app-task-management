import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthData } from './auth-data.model';
const BACKEND_API = environment.BACKEND_URL;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  createUser(username: string, password: string) {
    const authData: AuthData = {
      username,
      password,
    };
    this.http
      .post<AuthData>(BACKEND_API + '/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
